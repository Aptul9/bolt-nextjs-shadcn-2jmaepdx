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

interface NewUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewUserDialog({ isOpen, onClose }: NewUserDialogProps) {
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [birthDate, setBirthDate] = useState<Date>();

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
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter user's name" />
                </div>
                <div>
                  <Label htmlFor="subscriptionType">Subscription Type</Label>
                  <Select>
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
                  <Label>Expiration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !expirationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expirationDate ? (
                          format(expirationDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expirationDate}
                        onSelect={setExpirationDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="remainingSlots">Remaining Slots</Label>
                  <Input
                    id="remainingSlots"
                    type="number"
                    placeholder="Number of slots"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
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
                  <Input id="email" type="email" placeholder="user@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="(123) 456-7890" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter address" />
                </div>
                <div>
                  <Label>Birth Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthDate ? (
                          format(birthDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={birthDate}
                        onSelect={setBirthDate}
                        initialFocus
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
                  <Input id="birthPlace" placeholder="Enter birth place" />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" placeholder="Enter nationality" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
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
                    placeholder="Emergency contact number"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes here"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>Create User</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}