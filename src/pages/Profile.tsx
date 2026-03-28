import { User, Settings, Bell, Shield, CreditCard, LogOut, Moon, Sun, ChevronRight, Mail, Phone, MapPin, Calendar, Sparkles, Award } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'motion/react';

export function Profile() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
              AL
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Andrea Liang</h2>
              <p className="text-muted-foreground mb-3">1234567@example.com</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Premium Member</Badge>
                <Badge variant="secondary">Active Trader</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-grid">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">Andrea Liang</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">1234567@example.com</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">St. Louis, MO</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">January 2024</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Security</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 45 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">3 devices currently logged in</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Payment Methods</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">•••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge>Primary</Badge>
                </div>

                <Button variant="outline" className="w-full">
                  + Add Payment Method
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of significant price changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Trade Confirmations</p>
                    <p className="text-sm text-muted-foreground">Email confirmation for all trades</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Market News</p>
                    <p className="text-sm text-muted-foreground">Daily market updates and news</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">AI Insights</p>
                    <p className="text-sm text-muted-foreground">Weekly AI analysis and recommendations</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Educational Content</p>
                    <p className="text-sm text-muted-foreground">Tips and learning resources</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            {/* Display Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Show more information in less space</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Show Percentages</p>
                    <p className="text-sm text-muted-foreground">Display changes as percentages</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium mb-1">Currency Format</p>
                    <p className="text-sm text-muted-foreground">USD ($)</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </div>
            </Card>

            {/* Risk Profile */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Risk Profile</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Current Risk Level</p>
                    <Badge>Moderate</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your risk tolerance affects AI recommendations and portfolio suggestions.
                  </p>
                  <Button variant="outline" size="sm">Retake Risk Assessment</Button>
                </div>

                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="font-medium mb-2">Investment Goals</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Long-term Growth</Badge>
                    <Badge variant="secondary">Income Generation</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 border-destructive/20">
          <h3 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
              <div>
                <p className="font-medium">Log Out</p>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
              <Button variant="outline" className="gap-2">
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">Delete</Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}