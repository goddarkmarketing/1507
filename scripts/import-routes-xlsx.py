#!/usr/bin/env python3
"""Rebuild set1/set2 official routes in transfer-routes.ts from the latest Excel matrix."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = ROOT / "data" / "KRABI_LINKS_TAXI_3080_Routes_Origin_Category_First.xlsx"
TARGET = ROOT / "src" / "lib" / "data" / "transfer-routes.ts"

PRICE_KEYS = ("ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "SIG", "BUS")


def load_priced_routes(path: Path) -> list[dict]:
    wb = load_workbook(path, read_only=True, data_only=True)
    ws = wb["All_Routes"]
    headers = None
    rows: list[dict] = []
    for i, raw in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            headers = [str(h) if h is not None else "" for h in raw]
            continue
        row = dict(zip(headers, raw))
        eco = row.get("ECO")
        if eco is None or eco == "":
            continue
        # Skip custom:/unresolved location ids
        from_id = str(row["fromId"]).strip()
        to_id = str(row["toId"]).strip()
        if from_id.startswith("custom:") or to_id.startswith("custom:"):
            continue
        prices = {k: int(row[k] or 0) for k in PRICE_KEYS}
        rows.append(
            {
                "fromId": from_id,
                "toId": to_id,
                "distanceKm": int(row.get("distanceKm") or 0),
                "durationMin": int(row.get("durationMin") or 0),
                "category": str(row.get("category") or "city"),
                "prices": prices,
            }
        )
    wb.close()
    return rows


def route_ts(route: dict, indent: str = "  ") -> str:
    p = route["prices"]
    lines = [
        f"{indent}{{",
        f'{indent}  fromId: "{route["fromId"]}",',
        f'{indent}  toId: "{route["toId"]}",',
        f'{indent}  distanceKm: {route["distanceKm"]},',
        f'{indent}  durationMin: {route["durationMin"]},',
        f'{indent}  category: "{route["category"]}",',
        f"{indent}  prices: {{",
    ]
    for key in PRICE_KEYS:
        comma = "," if key != "BUS" else ""
        lines.append(f'{indent}    {key}: {p[key]}{comma}')
    lines.append(f"{indent}  }},")
    lines.append(f"{indent}}},")
    return "\n".join(lines)


def dedupe_non_airport(routes: list[dict]) -> list[dict]:
    """Keep one entry per undirected pair when prices match; prefer stable order."""
    by_pair: dict[tuple[str, str], list[dict]] = {}
    for route in routes:
        key = tuple(sorted([route["fromId"], route["toId"]]))
        by_pair.setdefault(key, []).append(route)

    out: list[dict] = []
    for key, group in by_pair.items():
        if len(group) == 1:
            out.append(group[0])
            continue
        # Prefer the lexicographically smaller fromId for stability
        group_sorted = sorted(group, key=lambda r: (r["fromId"], r["toId"]))
        out.append(group_sorted[0])
    # Stable presentation: hubs first, then alpha
    hub_rank = {
        "phuket-airport": 0,
        "ao-nang-beach": 1,
        "ao-nam-mao": 2,
        "klong-muang": 3,
        "tubkaak-beach": 4,
        "laem-kruat-pier": 5,
        "klong-jilad-pier": 6,
    }

    def sort_key(r: dict):
        return (hub_rank.get(r["fromId"], 50), r["fromId"], r["toId"])

    return sorted(out, key=sort_key)


def build_arrays(rows: list[dict]) -> tuple[str, str, dict]:
    set1 = [r for r in rows if r["fromId"] == "kbv-airport"]
    other = [r for r in rows if r["fromId"] != "kbv-airport"]
    # Drop reverse of set1 (kbv as toId) — index mirrors both ways
    other = [r for r in other if r["toId"] != "kbv-airport"]
    set2 = dedupe_non_airport(other)

    set1_block = "\n".join(route_ts(r) for r in set1)
    set2_block = "\n".join(route_ts(r) for r in set2)
    stats = {
        "set1": len(set1),
        "set2": len(set2),
        "source_priced": len(rows),
    }
    return set1_block, set2_block, stats


def patch_transfer_routes(set1_block: str, set2_block: str, source_name: str) -> None:
    text = TARGET.read_text(encoding="utf-8")

    set1_repl = (
        "/** Official Set 1 prices: Krabi Airport ↔ destinations "
        f"(THB, one way, both directions). Source: {source_name} */\n"
        "const set1OfficialRoutes: OfficialTransferRoute[] = [\n"
        f"{set1_block}\n"
        "];"
    )
    set2_repl = (
        "/** Official non-airport tariff rows (THB, one way, both directions). "
        f"Source: {source_name} */\n"
        "const set2OfficialRoutes: OfficialTransferRoute[] = [\n"
        f"{set2_block}\n"
        "];"
    )

    text2, n1 = re.subn(
        r"/\*\* Official Set 1 prices:[\s\S]*?const set1OfficialRoutes: OfficialTransferRoute\[\] = \[[\s\S]*?\n\];",
        set1_repl,
        text,
        count=1,
    )
    if n1 != 1:
        raise SystemExit(f"Failed to replace set1OfficialRoutes (matches={n1})")

    text3, n2 = re.subn(
        r"/\*\* Official Set 2:[\s\S]*?const set2OfficialRoutes: OfficialTransferRoute\[\] = \[[\s\S]*?\n\];",
        set2_repl,
        text2,
        count=1,
    )
    if n2 != 1:
        text3, n2 = re.subn(
            r"/\*\* Official non-airport tariff rows[\s\S]*?const set2OfficialRoutes: OfficialTransferRoute\[\] = \[[\s\S]*?\n\];",
            set2_repl,
            text2,
            count=1,
        )
    if n2 != 1:
        raise SystemExit(f"Failed to replace set2OfficialRoutes (matches={n2})")

    TARGET.write_text(text3, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--xlsx", type=Path, default=DEFAULT_XLSX)
    args = parser.parse_args()
    if not args.xlsx.exists():
        raise SystemExit(f"Missing Excel: {args.xlsx}")

    rows = load_priced_routes(args.xlsx)
    set1_block, set2_block, stats = build_arrays(rows)
    patch_transfer_routes(set1_block, set2_block, args.xlsx.name)
    print(
        f"Updated {TARGET.relative_to(ROOT)} "
        f"set1={stats['set1']} set2={stats['set2']} "
        f"from_priced={stats['source_priced']}"
    )


if __name__ == "__main__":
    main()
