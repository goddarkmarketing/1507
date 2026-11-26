#!/usr/bin/env python3
"""Import the full Excel route matrix (all directional rows, blank prices = 0)."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = ROOT / "data" / "KRABI_LINKS_TAXI_3080_Routes_Origin_Category_First.xlsx"
OUT_JSON = ROOT / "src" / "lib" / "data" / "transfer-routes-data.json"

PRICE_KEYS = ("ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "SIG", "BUS")


def load_all_routes(path: Path) -> list[dict]:
    wb = load_workbook(path, read_only=True, data_only=True)
    ws = wb["All_Routes"]
    headers = None
    rows: list[dict] = []
    for i, raw in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            headers = [str(h) if h is not None else "" for h in raw]
            continue
        row = dict(zip(headers, raw))
        from_id = str(row.get("fromId") or "").strip()
        to_id = str(row.get("toId") or "").strip()
        if not from_id or not to_id:
            continue
        if from_id.startswith("custom:") or to_id.startswith("custom:"):
            continue
        prices = {}
        for key in PRICE_KEYS:
            raw_price = row.get(key)
            if raw_price is None or raw_price == "":
                prices[key] = 0
            else:
                prices[key] = int(raw_price)
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


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--xlsx", type=Path, default=DEFAULT_XLSX)
    args = parser.parse_args()
    if not args.xlsx.exists():
        raise SystemExit(f"Missing Excel: {args.xlsx}")

    rows = load_all_routes(args.xlsx)
    priced = sum(1 for r in rows if r["prices"]["ECO"] > 0)
    OUT_JSON.write_text(
        json.dumps(rows, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {OUT_JSON.relative_to(ROOT)} "
        f"routes={len(rows)} priced={priced} unpriced={len(rows) - priced}"
    )


if __name__ == "__main__":
    main()
