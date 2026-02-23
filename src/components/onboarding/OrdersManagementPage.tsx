import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  Loader2,
  MoreVertical,
  Package,
  CheckCircle2,
  ShoppingCart,
} from 'lucide-react';
import { format } from 'date-fns';

interface CartItem {
  name: string;
  unit_price_text: string;
  unit_price_amount: number;
  unit_price_currency: string;
  qty: number;
  line_total_amount: number;
  suggested_asset_ids?: string[];
  product_ref?: {
    source_chunk_id: string;
    source_file_id: string;
  };
}

interface Order {
  business_id: string;
  thread_id: string;
  payment_id: string;
  email: string;
  address: string;
  country: string;
  amount: string;
  currency: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  cart_snapshot: {
    thread_id: string;
    business_id: string;
    items: CartItem[];
    summary: {
      item_count: number;
      subtotal_amount: number;
      currency: string;
    };
    updated_at: string;
  };
}

interface OrdersManagementPageProps {
  businessId: string;
}

export const OrdersManagementPage = ({ businessId }: OrdersManagementPageProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.getOrders({ business_id: businessId });
        setOrders(response.orders);
        setCount(response.count);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [businessId]);

  const handleMarkCompleted = async (paymentId: string) => {
    setUpdatingOrderId(paymentId);
    try {
      await api.updateOrderStatus({
        business_id: businessId,
        order_id: paymentId,
      });
      setOrders(prev =>
        prev.map(order =>
          order.payment_id === paymentId
            ? { ...order, status: 'success' }
            : order
        )
      );
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy · HH:mm');
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="fade-in mx-auto min-h-screen max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">
              {count} {count === 1 ? 'order' : 'orders'} total
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="card-elevated flex flex-col items-center justify-center rounded-2xl border border-border p-16 text-center">
          <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Orders will appear here once customers start purchasing
          </p>
        </div>
      ) : (
        <div className="card-elevated overflow-hidden rounded-2xl border border-border">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1.2fr_0.6fr_0.6fr_1fr_48px] gap-4 border-b border-border bg-secondary/30 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
            <span />
          </div>

          {/* Order Rows */}
          {orders.map(order => (
            <Collapsible
              key={order.payment_id}
              open={expandedOrder === order.payment_id}
              onOpenChange={(open) =>
                setExpandedOrder(open ? order.payment_id : null)
              }
            >
              <CollapsibleTrigger asChild>
                <div className="group grid cursor-pointer grid-cols-[1fr_1.2fr_0.6fr_0.6fr_1fr_48px] gap-4 border-b border-border px-6 py-4 transition-colors hover:bg-secondary/20">
                  <span className="flex items-center gap-2 truncate font-mono text-sm">
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        expandedOrder === order.payment_id ? 'rotate-180' : ''
                      }`}
                    />
                    {order.payment_id.slice(0, 12)}…
                  </span>
                  <span className="truncate text-sm">{order.email}</span>
                  <span className="text-sm font-medium">
                    {order.amount} {order.cart_snapshot?.summary?.currency || 'USDC'}
                  </span>
                  <span>
                    <Badge
                      variant={order.status === 'success' ? 'default' : 'destructive'}
                      className={
                        order.status === 'success'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-red-100 text-red-700 hover:bg-red-100'
                      }
                    >
                      {order.status === 'success' ? 'Completed' : 'Pending'}
                    </Badge>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </span>
                  <span
                    className="flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={
                            order.status === 'success' ||
                            updatingOrderId === order.payment_id
                          }
                          onClick={() => handleMarkCompleted(order.payment_id)}
                        >
                          {updatingOrderId === order.payment_id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                          )}
                          Mark as Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </span>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-b border-border bg-secondary/10 px-10 py-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Customer Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <Row label="Email" value={order.email} />
                        <Row label="Address" value={order.address} />
                        <Row label="Country" value={order.country} />
                        <Row label="Thread ID" value={order.thread_id} />
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Timeline
                      </h4>
                      <div className="space-y-2 text-sm">
                        <Row label="Created" value={formatDate(order.created_at)} />
                        <Row label="Updated" value={formatDate(order.updated_at)} />
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Cart Items
                    </h4>
                    <div className="overflow-hidden rounded-xl border border-border">
                      <div className="grid grid-cols-[2fr_0.5fr_0.8fr_0.8fr] gap-4 bg-secondary/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span>Product</span>
                        <span>Qty</span>
                        <span>Unit Price</span>
                        <span>Total</span>
                      </div>
                      {order.cart_snapshot.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[2fr_0.5fr_0.8fr_0.8fr] gap-4 border-t border-border px-4 py-3 text-sm"
                        >
                          <span className="font-medium">{item.name}</span>
                          <span>{item.qty}</span>
                          <span>
                            {item.unit_price_amount} {item.unit_price_currency}
                          </span>
                          <span className="font-medium">
                            {item.line_total_amount} {item.unit_price_currency}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end pt-2">
                      <div className="rounded-lg bg-secondary/40 px-4 py-2 text-sm">
                        <span className="text-muted-foreground">Subtotal: </span>
                        <span className="font-semibold">
                          {order.cart_snapshot.summary.subtotal_amount}{' '}
                          {order.cart_snapshot.summary.currency}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          · {order.cart_snapshot.summary.item_count}{' '}
                          {order.cart_snapshot.summary.item_count === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2">
    <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
    <span className="break-all">{value}</span>
  </div>
);
