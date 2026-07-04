import { useState } from 'react';
import { mockPurchaseOrders, PurchaseOrder, PurchaseOrderItem } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Search, MoreHorizontal, Eye, Truck, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-slate-500/10 text-slate-500' },
  pending: { label: '待审核', className: 'bg-amber-500/10 text-amber-500' },
  approved: { label: '已审核', className: 'bg-blue-500/10 text-blue-500' },
  received: { label: '已入库', className: 'bg-emerald-500/10 text-emerald-500' },
  cancelled: { label: '已取消', className: 'bg-red-500/10 text-red-500' },
};

export default function PurchasesPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = orders.filter(
    (o) => o.orderNo.includes(search) || o.supplierName.includes(search)
  );

  const handleStatusChange = (id: string, newStatus: PurchaseOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">采购管理</h1>
          <p className="text-muted-foreground">管理采购订单与入库</p>
        </div>
        <Button className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          新增采购单
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: '采购单总数', value: orders.length, color: 'text-primary' },
          { label: '待审核', value: orders.filter(o => o.status === 'pending').length, color: 'text-amber-500' },
          { label: '已入库', value: orders.filter(o => o.status === 'received').length, color: 'text-emerald-500' },
          { label: '采购总额', value: `¥${(orders.reduce((s, o) => s + o.totalAmount, 0) / 10000).toFixed(1)}万`, color: 'text-blue-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>采购单列表</CardTitle>
              <CardDescription>共 {filtered.length} 条记录</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索采购单号..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>采购单号</TableHead>
                <TableHead>供应商</TableHead>
                <TableHead>采购金额</TableHead>
                <TableHead>商品数量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead className="w-[120px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">{order.orderNo}</TableCell>
                    <TableCell>{order.supplierName}</TableCell>
                    <TableCell className="font-mono font-medium">
                      ¥{order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{order.items.reduce((s: number, i) => s + i.quantity, 0)} 件</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => { setSelectedOrder(order); setDetailOpen(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-500"
                            onClick={() => handleStatusChange(order.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'approved' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500"
                            onClick={() => handleStatusChange(order.id, 'received')}
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        )}
                        {(order.status === 'draft' || order.status === 'pending') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>采购单详情</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNo} - {selectedOrder?.supplierName}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">供应商：{selectedOrder.supplierName}</span>
                <span className="text-muted-foreground">日期：{selectedOrder.createdAt}</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>产品</TableHead>
                    <TableHead>数量</TableHead>
                    <TableHead>单价</TableHead>
                    <TableHead>小计</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.items.map((item: PurchaseOrderItem, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>¥{item.price.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">
                        ¥{(item.quantity * item.price).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right font-bold text-lg">
                合计：¥{selectedOrder.totalAmount.toLocaleString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
