import { useState } from 'react';
import { mockCustomers, Customer } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
} from 'lucide-react';

const levelColors: Record<string, string> = {
  VIP: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  A: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  B: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  C: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = customers.filter(
    (c) =>
      c.name.includes(search) ||
      c.company.includes(search) ||
      c.phone.includes(search)
  );

  const handleDelete = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">客户管理</h1>
          <p className="text-muted-foreground">管理您的客户信息和关系</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增客户
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{selectedCustomer ? '编辑客户' : '新增客户'}</DialogTitle>
              <DialogDescription>填写客户基本信息</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>客户名称</Label>
                  <Input placeholder="请输入客户名称" />
                </div>
                <div className="space-y-2">
                  <Label>公司名称</Label>
                  <Input placeholder="请输入公司名称" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>手机号码</Label>
                  <Input placeholder="请输入手机号码" />
                </div>
                <div className="space-y-2">
                  <Label>邮箱</Label>
                  <Input placeholder="请输入邮箱" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>客户等级</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择等级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="A">A级</SelectItem>
                      <SelectItem value="B">B级</SelectItem>
                      <SelectItem value="C">C级</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>来源</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择来源" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="展会">展会</SelectItem>
                      <SelectItem value="转介绍">转介绍</SelectItem>
                      <SelectItem value="网站">网站</SelectItem>
                      <SelectItem value="广告">广告</SelectItem>
                      <SelectItem value="电话营销">电话营销</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="mt-2">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: '全部客户', value: customers.length, color: 'text-primary' },
          { label: 'VIP客户', value: customers.filter(c => c.level === 'VIP').length, color: 'text-purple-500' },
          { label: '活跃客户', value: customers.filter(c => c.status === 'active').length, color: 'text-emerald-500' },
          { label: '本月新增', value: 3, color: 'text-blue-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>客户列表</CardTitle>
              <CardDescription>共 {filtered.length} 位客户</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索客户名称、公司..."
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
                <TableHead>客户名称</TableHead>
                <TableHead>公司</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>等级</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>行业</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {customer.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {customer.phone}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {customer.address}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={levelColors[customer.level]}>
                      {customer.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{customer.source}</TableCell>
                  <TableCell className="text-sm">{customer.industry}</TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.status === 'active' ? 'default' : 'secondary'}
                      className={customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                    >
                      {customer.status === 'active' ? '活跃' : '非活跃'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedCustomer(customer); setDialogOpen(true); }}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
