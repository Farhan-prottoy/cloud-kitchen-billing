import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteBill } from "./billingSlice";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Plus, Trash2, Edit } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const EventList = () => {
  const dispatch = useAppDispatch();
  const bills = useAppSelector((state) =>
    state.billing.bills.filter((b) => b.type === "Event")
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      dispatch(deleteBill(id));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Event Billing</CardTitle>
        <Link to="/events/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Event Bill
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Event Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No event bills found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">
                    {bill.clientName}
                  </TableCell>
                  <TableCell>{bill.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{bill.contactPerson}</span>
                      <span className="text-xs text-muted-foreground">
                        {bill.contactNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(bill.grandTotal)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/events/edit/${bill.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(bill.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EventList;
