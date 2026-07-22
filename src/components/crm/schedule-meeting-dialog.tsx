"use client";

import * as React from "react";
import { CalendarPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ScheduleMeetingFormValues {
  title: string;
  startTime: string;
  location: string;
}

export function ScheduleMeetingDialog() {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleMeetingFormValues>();

  function onSubmit(values: ScheduleMeetingFormValues) {
    toast.success(`"${values.title}" was scheduled.`);
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <CalendarPlus className="size-4" />
        Schedule Meeting
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>Add a new meeting to your calendar.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g. Discovery Call"
                  {...register("title", { required: "Title is required" })}
                />
                <FieldError errors={[errors.title]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="startTime">Date &amp; time</FieldLabel>
                <Input
                  id="startTime"
                  type="datetime-local"
                  {...register("startTime", { required: "Date and time are required" })}
                />
                <FieldError errors={[errors.startTime]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input id="location" placeholder="e.g. Google Meet" {...register("location")} />
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter>
            <Button type="submit">Schedule Meeting</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
