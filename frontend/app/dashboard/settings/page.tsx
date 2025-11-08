"use client";

import { useState } from "react";
import {
  Building2,
  DollarSign,
  Bell,
  Printer,
  Shield,
  Palette,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  // Business Settings
  const [businessName, setBusinessName] = useState("MediCare Pharmacy");
  const [ownerName, setOwnerName] = useState("John Anderson");
  const [email, setEmail] = useState("contact@medicare.com");
  const [phone, setPhone] = useState("+880 1712-345678");
  const [address, setAddress] = useState(
    "123 Health Street, Dhaka, Bangladesh"
  );
  const [taxId, setTaxId] = useState("TAX-2024-001");
  const [licenseNumber, setLicenseNumber] = useState("PHL-BD-2024-456");

  // Financial Settings
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState("15");
  const [defaultDiscount, setDefaultDiscount] = useState("0");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [duePaymentAlerts, setDuePaymentAlerts] = useState(true);

  // Receipt Settings
  const [showLogo, setShowLogo] = useState(true);
  const [showTaxId, setShowTaxId] = useState(true);
  const [receiptFooter, setReceiptFooter] = useState(
    "Thank you for your purchase! Visit again."
  );

  // Appearance Settings
  const [theme, setTheme] = useState("light");
  const [compactMode, setCompactMode] = useState(false);

  const handleSaveSettings = () => {
    // Here you would save to backend
    console.log("Saving settings...");
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border-gray bg-white">
        <h1 className="text-2xl font-bold text-dark-blue">Settings</h1>
        <p className="text-sm text-dark-text mt-0.5">
          Manage your pharmacy configuration and preferences
        </p>
      </div>

      <div className="px-4 pb-4">
        <Tabs defaultValue="business" className="w-full">
          <TabsList className="bg-light-gray border border-border-gray mb-3">
            <TabsTrigger
              value="business"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Business
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="receipt"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Receipt
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
            >
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-primary-blue data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Business Settings */}
          <TabsContent value="business" className="space-y-3 mt-0">
            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="business-name"
                      className="text-sm text-dark-text"
                    >
                      Business Name
                    </Label>
                    <Input
                      id="business-name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="owner-name"
                      className="text-sm text-dark-text"
                    >
                      Owner Name
                    </Label>
                    <Input
                      id="owner-name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm text-dark-text">
                      Email Address
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 h-9 border-border-gray focus:border-primary-blue shadow-none"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm text-dark-text">
                      Phone Number
                    </Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-text/50" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9 h-9 border-border-gray focus:border-primary-blue shadow-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm text-dark-text">
                    Business Address
                  </Label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-dark-text/50" />
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-9 min-h-20 border-border-gray focus:border-primary-blue shadow-none resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="tax-id" className="text-sm text-dark-text">
                      Tax ID / TIN
                    </Label>
                    <Input
                      id="tax-id"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="license" className="text-sm text-dark-text">
                      Pharmacy License Number
                    </Label>
                    <Input
                      id="license"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo" className="text-sm text-dark-text">
                    Business Logo
                  </Label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="h-9 border-border-gray hover:bg-light-gray shadow-none"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <span className="text-xs text-dark-text/60">
                      PNG, JPG up to 2MB
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Settings */}
          <TabsContent value="financial" className="space-y-3 mt-0">
            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Financial Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="currency"
                      className="text-sm text-dark-text"
                    >
                      Default Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="mt-1.5 h-9 border-border-gray shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="shadow-none border-border-gray">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="BDT">BDT (৳)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="tax-rate"
                      className="text-sm text-dark-text"
                    >
                      Default Tax Rate (%)
                    </Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="default-discount"
                      className="text-sm text-dark-text"
                    >
                      Default Discount (%)
                    </Label>
                    <Input
                      id="default-discount"
                      type="number"
                      value={defaultDiscount}
                      onChange={(e) => setDefaultDiscount(e.target.value)}
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="low-stock"
                      className="text-sm text-dark-text"
                    >
                      Low Stock Threshold
                    </Label>
                    <Input
                      id="low-stock"
                      type="number"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Invoice Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="invoice-prefix"
                      className="text-sm text-dark-text"
                    >
                      Invoice Number Prefix
                    </Label>
                    <Input
                      id="invoice-prefix"
                      placeholder="INV-"
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="invoice-start"
                      className="text-sm text-dark-text"
                    >
                      Starting Invoice Number
                    </Label>
                    <Input
                      id="invoice-start"
                      type="number"
                      placeholder="1000"
                      className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-3 mt-0">
            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      Email Notifications
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    className="data-[state=checked]:bg-primary-blue"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      SMS Notifications
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    className="data-[state=checked]:bg-primary-blue"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      Low Stock Alerts
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Get notified when stock falls below threshold
                    </p>
                  </div>
                  <Switch
                    checked={lowStockAlerts}
                    onCheckedChange={setLowStockAlerts}
                    className="data-[state=checked]:bg-primary-blue"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      Expiry Date Alerts
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Alerts for medicines nearing expiration
                    </p>
                  </div>
                  <Switch
                    checked={expiryAlerts}
                    onCheckedChange={setExpiryAlerts}
                    className="data-[state=checked]:bg-primary-blue"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      Due Payment Alerts
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Notify for pending customer payments
                    </p>
                  </div>
                  <Switch
                    checked={duePaymentAlerts}
                    onCheckedChange={setDuePaymentAlerts}
                    className="data-[state=checked]:bg-primary-blue"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipt Settings */}
          <TabsContent value="receipt" className="space-y-3 mt-0">
            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Receipt Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      Show Logo on Receipt
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Display business logo on printed receipts
                    </p>
                  </div>
                  <Switch
                    checked={showLogo}
                    onCheckedChange={setShowLogo}
                    className="data-[state=checked]:bg-primary-blue"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      Show Tax ID on Receipt
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Include tax identification number
                    </p>
                  </div>
                  <Switch
                    checked={showTaxId}
                    onCheckedChange={setShowTaxId}
                    className="data-[state=checked]:bg-primary-blue"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="receipt-footer"
                    className="text-sm text-dark-text"
                  >
                    Receipt Footer Message
                  </Label>
                  <Textarea
                    id="receipt-footer"
                    value={receiptFooter}
                    onChange={(e) => setReceiptFooter(e.target.value)}
                    className="mt-1.5 min-h-20 border-border-gray focus:border-primary-blue shadow-none resize-none"
                    placeholder="Thank you message..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-3 mt-0">
            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Display Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="theme" className="text-sm text-dark-text">
                    Theme
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="mt-1.5 h-9 border-border-gray shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="shadow-none border-border-gray">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      Compact Mode
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Reduce spacing for denser layout
                    </p>
                  </div>
                  <Switch
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                    className="data-[state=checked]:bg-primary-blue"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-3 mt-0">
            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label
                    htmlFor="current-password"
                    className="text-sm text-dark-text"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="new-password"
                    className="text-sm text-dark-text"
                  >
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="confirm-password"
                    className="text-sm text-dark-text"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="mt-1.5 h-9 border-border-gray focus:border-primary-blue shadow-none"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full h-9 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white shadow-none"
                >
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border-gray shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-dark-blue">
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 border border-border-gray rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-dark-blue">
                      Enable 2FA
                    </p>
                    <p className="text-xs text-dark-text/60 mt-0.5">
                      Add extra security to your account
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-primary-blue" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSaveSettings}
            className="h-10 bg-success hover:bg-success/90 text-white shadow-none"
          >
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
