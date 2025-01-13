"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

interface NewUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  name: string;
  subscriptionType: string;
  status: boolean;
  expiresAt: Date | undefined;
  remainingSlots: number | null;
  email: string;
  phoneNumber: string;
  address?: string;
  birthDate?: Date;
  birthPlace?: string;
  nationality?: string;
  gender?: string;
  emergencyContact?: string;
  notes?: string;
}

export function NewUserDialog({ isOpen, onClose }: NewUserDialogProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    subscriptionType: "",
    status: true,
    expiresAt: undefined,
    remainingSlots: null,
    email: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.subscriptionType) {
      toast.error("Subscription type is required");
      return;
    }
    if (!formData.expiresAt) {
      toast.error("Expiration date is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/supabase/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "tenant-id": "de51a5d5-0648-484c-9a29-88b39c2b0080",
        },
        body: JSON.stringify({
          name: formData.name,
          subscriptionType: formData.subscriptionType,
          status: formData.status,
          expiresAt: formData.expiresAt.toISOString(),
          remainingSlots: formData.subscriptionType === "Slots" ? formData.remainingSlots : null,
          userInfo: {
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            birthDate: formData.birthDate?.toISOString(),
            birthPlace: formData.birthPlace,
            nationality: formData.nationality,
            gender: formData.gender,
            emergencyContact: formData.emergencyContact,
            notes: formData.notes,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      toast.success("User created successfully");
      onClose();
      // Reset form
      setFormData({
        name: "",
        subscriptionType: "",
        status: true,
        expiresAt: undefined,
        remainingSlots: null,
        email: "",
        phoneNumber: "",
      });
      
      // Reload the page to refresh the user list
      window.location.reload();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[94vh] md:max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New User</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pl-1 pr-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Subscription Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter user's name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subscriptionType">
                    Subscription Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.subscriptionType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        subscriptionType: value,
                        remainingSlots: value === "Slots" ? 0 : null,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Slots">Slots</SelectItem>
                      <SelectItem value="Unlimited">Unlimited</SelectItem>
                      <SelectItem value="H24">24/7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>
                    Expiration Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.expiresAt && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.expiresAt ? (
                          format(formData.expiresAt, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.expiresAt}
                        onSelect={(date) =>
                          setFormData({ ...formData, expiresAt: date ?? undefined })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {formData.subscriptionType === "Slots" && (
                  <div>
                    <Label htmlFor="remainingSlots">
                      Remaining Slots <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="remainingSlots"
                      type="number"
                      min="0"
                      value={formData.remainingSlots || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          remainingSlots: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Number of slots"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status ? "active" : "inactive"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value === "active",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <Label>Birth Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.birthDate ? (
                          format(formData.birthDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.birthDate}
                        onSelect={(date) =>
                          setFormData({ ...formData, birthDate: date ?? undefined })
                        }
                        initialFocus
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthPlace">Birth Place</Label>
                  <Input
                    id="birthPlace"
                    value={formData.birthPlace || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, birthPlace: e.target.value })
                    }
                    placeholder="Enter birth place"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    placeholder="Enter nationality"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: e.target.value,
                      })
                    }
                    placeholder="Emergency contact number"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Add any additional notes here"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}