import { useState } from 'react';
import { mockProducts } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Search, Warehouse, AlertTriangle, ArrowUpDown, TrendingDown, TrendingUp } from 'lucide-react';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'stock' | 'name'>('stock');
  const [sortAsc, setSortAsc] = useState(true);

  const products = [...mockProducts].sort((a, b) => {
    if (sortField === 'stock') {
      return sortAsc ? a.stock - b.stock : b.stock - a.stock;
    }
    return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  });

  const filtered = products.filter(
    (p) => p.name.includes(search) || p.code.includes(search) || p.category.includes(search)
  );

  const totalStockValue = mockProducts.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStockCount = mockProducts.filter(p => p.stock <= p.minStock).length;
  const totalItems = mockProducts.reduce((s, p) => s + p.stock, 0);

  const toggleSort = (field: 'stock' | 'name') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">库存管理</h1>
          <p className="text-muted-foreground">实时库存监控与管理</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: '库存总价值', value: `¥${(totalStockValue / 10000).toFixed(1)}万`, icon: Warehouse, color: 'text-primary' },
          { label: '商品种类', value: products.length, icon: ArrowUpDown, color: 'text-blue-500' },
          { label: '总库存量', value: totalItems, icon: TrendingUp, color: 'text-emerald-500' },
          { label: '库存预警', value: lowStockCount, icon: AlertTriangle, color: 'text-red-500' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>库存列表</CardTitle>
              <CardDescription>实时库存状态</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索产品..."
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
                <TableHead className="cursor-pointer hover:text-primary" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">
                    产品名称
                    {sortField === 'name' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead>分类</TableHead>
                <TableHead>单位</TableHead>
                <TableHead className="cursor-pointer hover:text-primary" onClick={() => toggleSort('stock')}>
                  <div className="flex items-center gap-1">
                    库存数量
                    {sortField === 'stock' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead>安全库存</TableHead>
                <TableHead>库存水平</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const stockPercent = Math.min((product.stock / (product.minStock * 3)) * 100, 100);
                const isLow = product.stock <= product.minStock;
                const isWarning = product.stock <= product.minStock * 2 && !isLow;

                return (
                  <TableRow key={product.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.code}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className={isLow ? 'text-red-500 font-bold' : 'font-medium'}>
                          {product.stock}
                        </span>
                        {isLow && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.minStock}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={stockPercent}
                          className={`h-2 w-24 ${isLow ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
                        />
                        <span className="text-xs text-muted-foreground">{Math.round(stockPercent)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          库存不足
                        </Badge>
                      ) : isWarning ? (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                          库存偏低
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          库存充足
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
