import React from "react";
import { useAppSelector } from "../app/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { formatCurrency } from "../utils/formatters";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { bills } = useAppSelector((state) => state.billing);

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.grandTotal, 0);
  const corporateBills = bills.filter((b) => b.type === "Corporate");
  const eventBills = bills.filter((b) => b.type === "Event");

  const corporateRevenue = corporateBills.reduce(
    (sum, bill) => sum + bill.grandTotal,
    0
  );
  const eventRevenue = eventBills.reduce(
    (sum, bill) => sum + bill.grandTotal,
    0
  );

  const recentBills = [...bills]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-heading font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary neon-text">
          COMMAND CENTER
        </h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-mono animate-pulse">
          <Activity size={16} />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            sub: "Gross Income",
            icon: DollarSign,
            color: "text-primary",
          },
          {
            title: "Corporate Bills",
            value: corporateBills.length,
            sub: formatCurrency(corporateRevenue),
            icon: Users,
            color: "text-blue-400",
          },
          {
            title: "Event Bills",
            value: eventBills.length,
            sub: formatCurrency(eventRevenue),
            icon: Calendar,
            color: "text-purple-400",
          },
          {
            title: "Avg. Bill Value",
            value: formatCurrency(
              bills.length ? totalRevenue / bills.length : 0
            ),
            sub: "Per Transaction",
            icon: TrendingUp,
            color: "text-green-400",
          },
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="relative overflow-hidden group h-full">
              <div
                className={`absolute -right-6 -top-6 rounded-full p-8 opacity-10 bg-current ${stat.color} group-hover:scale-150 transition-transform duration-500`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-0">
                <CardTitle className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold font-mono ${stat.color} neon-text`}
                >
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 glass-panel md:col-span-7">
          <CardHeader>
            <CardTitle>Recent Transmissions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest billing activities detected.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No data stream found.
                </p>
              ) : (
                recentBills.map((bill, index) => (
                  <motion.div
                    key={bill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {bill.type === "Corporate" ? (
                          <Users size={18} />
                        ) : (
                          <Calendar size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-primary transition-colors">
                          {bill.clientName}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {bill.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-primary">
                        {formatCurrency(bill.grandTotal)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bill.date).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
