"use client";

import { QRCodeSVG } from "qrcode.react";
import { Download, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SiteLogo } from "@/components/shared/site-logo";
import { getLocation } from "@/lib/data/locations";
import { vehicles } from "@/lib/data/vehicles";
import { siteConfig } from "@/lib/site-config";
import type { Booking } from "@/lib/types";

interface EVoucherProps {
  booking: Booking;
}

export function EVoucher({ booking }: EVoucherProps) {
  const qrData = JSON.stringify({
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    total: booking.totalPrice,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <div className="text-center">
        <div className="mb-3 flex justify-center">
          <SiteLogo height={56} />
        </div>
        <Badge className="mb-2">
          {booking.status === "pending"
            ? "e-Voucher · Pending Payment"
            : "e-Voucher Confirmed"}
        </Badge>
        <p className="text-muted-foreground">{siteConfig.sloganEn}</p>
      </div>

      <Card className="overflow-hidden border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Booking #{booking.bookingNumber}</CardTitle>
              <CardDescription>
                Confirmed on {new Date(booking.createdAt).toLocaleString()}
              </CardDescription>
            </div>
            <div className="rounded-lg bg-white p-2">
              <QRCodeSVG value={qrData} size={96} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <User className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{booking.customerName}</p>
                <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Support</p>
                <p className="text-sm text-muted-foreground">{siteConfig.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="font-semibold capitalize">
              {booking.type.replace("-", " ")} · {booking.legs.length} leg
              {booking.legs.length > 1 ? "s" : ""}
            </p>
            {booking.legs.map((leg, i) => {
              const from = getLocation(leg.fromId);
              const to = getLocation(leg.toId);
              const vehicle = vehicles.find((v) => v.code === leg.vehicleCode);
              return (
                <div
                  key={leg.id}
                  className="rounded-lg border bg-muted/30 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Leg {i + 1}</Badge>
                    <span className="font-bold">฿{leg.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <p>
                        <span className="text-muted-foreground">Pickup:</span>{" "}
                        {from?.name}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Drop-off:</span>{" "}
                        {to?.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Date & Time:</span>{" "}
                    {leg.date} at {leg.time}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Vehicle:</span>{" "}
                    {vehicle?.code} — {vehicle?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Driver details will be sent 24 hours before pickup
                  </p>
                </div>
              );
            })}
          </div>

          {booking.flightNumber && (
            <p className="text-sm">
              <span className="text-muted-foreground">Flight:</span>{" "}
              {booking.flightNumber}
            </p>
          )}
          {booking.notes && (
            <p className="text-sm">
              <span className="text-muted-foreground">Notes:</span> {booking.notes}
            </p>
          )}

          <Separator />

          {booking.payment && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="font-semibold">Payment</p>
              <p>
                <span className="text-muted-foreground">Method:</span>{" "}
                {booking.payment.summary}
              </p>
              <p>
                <span className="text-muted-foreground">Status:</span>{" "}
                {booking.payment.status === "paid"
                  ? "Paid (mock)"
                  : "Awaiting bank transfer verification"}
              </p>
              {booking.payment.bankSymbol && (
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/banks/${booking.payment.bankSymbol}.png`}
                    alt={booking.payment.bankSymbol}
                    className="size-8 rounded object-contain"
                  />
                  <span className="text-muted-foreground">
                    Account: {booking.payment.bankSymbol}
                  </span>
                </div>
              )}
              {booking.payment.transferProof && (
                <div className="space-y-2">
                  <p className="font-medium">Transfer proof</p>
                  <p className="text-xs text-muted-foreground">
                    {booking.payment.transferProof.fileName}
                  </p>
                  {booking.payment.transferProof.fileType.startsWith(
                    "image/"
                  ) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.payment.transferProof.dataUrl}
                      alt="Transfer proof"
                      className="max-h-64 w-full rounded-md border object-contain bg-white"
                    />
                  ) : (
                    <a
                      href={booking.payment.transferProof.dataUrl}
                      download={booking.payment.transferProof.fileName}
                      className="inline-flex text-sm font-medium text-primary underline underline-offset-2"
                    >
                      Download PDF slip
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-lg font-bold">
            <span>
              {booking.payment?.status === "awaiting-transfer"
                ? "Total Due"
                : "Total Paid"}
            </span>
            <span className="text-primary">
              ฿{booking.totalPrice.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="size-4" />
          Print Voucher
        </Button>
        <ButtonLink href="/booking">
          New Booking
        </ButtonLink>
      </div>
    </div>
  );
}
