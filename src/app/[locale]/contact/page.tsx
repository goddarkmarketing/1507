"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSiteContact } from "@/lib/admin/settings-store";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const site = useSiteContact();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success(t("toastOk"));
  };

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-2 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("sendTitle")}</CardTitle>
            <CardDescription>{t("sendSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">{t("name")}</Label>
                  <Input id="contact-name" required placeholder={t("phName")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">{t("email")}</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    required
                    placeholder={t("phEmail")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-subject">{t("subject")}</Label>
                <Input
                  id="contact-subject"
                  required
                  placeholder={t("phSubject")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">{t("message")}</Label>
                <Textarea
                  id="contact-message"
                  required
                  rows={5}
                  placeholder={t("phMessage")}
                />
              </div>
              <Button type="submit" className="w-full">
                {t("send")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("getInTouch")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">{t("phone")}</p>
                  <a
                    href={`tel:${site.phone}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {site.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">{t("email")}</p>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {site.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="font-medium">{t("address")}</p>
                  <p className="text-muted-foreground">{site.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("lineTitle")}</CardTitle>
              <CardDescription>{t("lineSubtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-lg">{site.line}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
