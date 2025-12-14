import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addBill, updateBill } from "./billingSlice";
import { Bill, LineItem } from "./types";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { amountToWords, formatCurrency } from "../../utils/formatters";
import { v4 as uuidv4 } from "uuid";

type FormValues = {
  clientName: string;
  contactPerson: string;
  contactNumber: string;
  date: string;
  items: {
    serviceDate: string;
    packageType: string;
    quantity: number;
    unitPrice: number;
  }[];
};

const CorporateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const existingBill = useAppSelector((state) =>
    state.billing.bills.find((b) => b.id === id)
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      clientName: "",
      contactPerson: "",
      contactNumber: "",
      date: new Date().toISOString().split("T")[0],
      items: [
        { serviceDate: "", packageType: "Standard", quantity: 1, unitPrice: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch items to calculate totals
  const items = watch("items");
  const grandTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const amountWords = amountToWords(grandTotal);

  useEffect(() => {
    if (id && existingBill) {
      setValue("clientName", existingBill.clientName);
      setValue("contactPerson", existingBill.contactPerson);
      setValue("contactNumber", existingBill.contactNumber);
      setValue("date", existingBill.date);
      // Map existing items back to form structure
      const formItems = existingBill.items.map((item) => ({
        serviceDate: item.serviceDate || "",
        packageType: item.packageType || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
      setValue("items", formItems);
    }
  }, [id, existingBill, setValue]);

  const onSubmit = (data: FormValues) => {
    // Transform form data to Bill object
    const lineItems: LineItem[] = data.items.map((item) => ({
      id: uuidv4(),
      description: `Service on ${item.serviceDate}`,
      serviceDate: item.serviceDate,
      packageType: item.packageType,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
    }));

    const bill: Bill = {
      id: id || uuidv4(),
      type: "Corporate",
      clientName: data.clientName,
      contactPerson: data.contactPerson,
      contactNumber: data.contactNumber,
      date: data.date,
      items: lineItems,
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    if (id) {
      dispatch(updateBill(bill));
    } else {
      dispatch(addBill(bill));
    }
    navigate("/corporate");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/corporate")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {id ? "Edit" : "Create"} Corporate Bill
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Corporate Name</label>
              <Input
                {...register("clientName", { required: true })}
                placeholder="e.g. Acme Corp"
              />
              {errors.clientName && (
                <span className="text-xs text-destructive">Required</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Billing Date</label>
              <Input type="date" {...register("date", { required: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Person</label>
              <Input
                {...register("contactPerson", { required: true })}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <Input
                {...register("contactNumber", { required: true })}
                placeholder="e.g. 01700000000"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Service Details</CardTitle>
            <Button
              type="button"
              onClick={() =>
                append({
                  serviceDate: "",
                  packageType: "Standard",
                  quantity: 1,
                  unitPrice: 0,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Date
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-4 grid-cols-1 md:grid-cols-12 items-end border p-4 rounded-lg bg-muted/20"
                >
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium">Service Date</label>
                    <Input
                      type="date"
                      {...register(`items.${index}.serviceDate` as const, {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium">Package Type</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register(`items.${index}.packageType` as const)}
                    >
                      <option value="Economy">Economy</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-medium">Persons</label>
                    <Input
                      type="number"
                      min="1"
                      {...register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-medium">Unit Price</label>
                    <Input
                      type="number"
                      min="0"
                      {...register(`items.${index}.unitPrice` as const, {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                  </div>
                  <div className="md:col-span-1 space-y-2 font-medium text-right pb-2">
                    {formatCurrency(
                      (items[index]?.quantity || 0) *
                        (items[index]?.unitPrice || 0)
                    )}
                  </div>
                  <div className="md:col-span-1 pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-end gap-2 border-t pt-4">
              <div className="flex items-center gap-8 text-lg font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
              <div className="text-muted-foreground text-sm italic">
                {amountWords}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/corporate")}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg">
            Save Bill
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CorporateForm;
