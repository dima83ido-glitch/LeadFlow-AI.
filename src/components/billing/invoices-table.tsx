import { Download } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { mockInvoices } from "@/lib/mock/billing";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";

export async function InvoicesTable() {
  const t = await getTranslations("billing.invoices");
  const locale = await getLocale();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columnInvoice")}</TableHead>
              <TableHead>{t("columnAmount")}</TableHead>
              <TableHead>{t("columnStatus")}</TableHead>
              <TableHead>{t("columnDate")}</TableHead>
              <TableHead className="text-right">{t("columnReceipt")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{formatCurrency(invoice.amount, undefined, locale)}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(invoice.issuedAt, locale)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="size-8">
                    <Download className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
