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
  eventName: string;
  contactPerson: string;
  contactNumber: string;
  eventDate: string;
  items: {
    packageName: string;
    packageType: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
};

const EventForm = () => {
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
      eventName: "",
      contactPerson: "",
      contactNumber: "",
      eventDate: new Date().toISOString().split("T")[0],
      items: [
        {
          packageName: "Package-1",
          packageType: "Standard",
          description: "Mixed Platter",
          quantity: 30,
          unitPrice: 200,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const grandTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const amountWords = amountToWords(grandTotal);

  useEffect(() => {
    if (id && existingBill) {
      setValue("eventName", existingBill.clientName);
      setValue("contactPerson", existingBill.contactPerson);
      setValue("contactNumber", existingBill.contactNumber);
      setValue("eventDate", existingBill.date);
      const formItems = existingBill.items.map((item) => ({
        packageName: item.packageName || "",
        packageType: item.packageType || "",
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
      setValue("items", formItems);
    }
  }, [id, existingBill, setValue]);

  const onSubmit = (data: FormValues) => {
    const lineItems: LineItem[] = data.items.map((item) => ({
      id: uuidv4(),
      description: item.description,
      packageName: item.packageName,
      packageType: item.packageType,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
    }));

    const bill: Bill = {
      id: id || uuidv4(),
      type: "Event",
      clientName: data.eventName,
      contactPerson: data.contactPerson,
      contactNumber: data.contactNumber,
      date: data.eventDate,
      items: lineItems,
      grandTotal,
      createdAt: new Date().toISOString(),
    };

    if (id) {
      dispatch(updateBill(bill));
    } else {
      dispatch(addBill(bill));
    }
    navigate("/events");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/events")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          {id ? "Edit" : "Create"} Event Bill
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Name</label>
              <Input
                {...register("eventName", { required: true })}
                placeholder="e.g. Annual Dinner"
              />
              {errors.eventName && (
                <span className="text-xs text-destructive">Required</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Date</label>
              <Input
                type="date"
                {...register("eventDate", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Person</label>
              <Input
                {...register("contactPerson", { required: true })}
                placeholder="e.g. Jane Doe"
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
            <CardTitle>Package Details</CardTitle>
            <Button
              type="button"
              onClick={() =>
                append({
                  packageName: "New Package",
                  packageType: "Standard",
                  description: "",
                  quantity: 10,
                  unitPrice: 0,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add Package
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
                    <label className="text-xs font-medium">Package Name</label>
                    <Input
                      {...register(`items.${index}.packageName` as const, {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-medium">Description</label>
                    <Input
                      {...register(`items.${index}.description` as const)}
                      placeholder="Food items..."
                    />
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
            onClick={() => navigate("/events")}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg">
            Save Event Bill
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
