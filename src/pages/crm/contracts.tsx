import { useState } from 'react';
import { mockContracts, Contract } from '@/lib/mock-data';
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
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, MoreHorizontal, Edit, Trash2, FileText } from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-slate-500/10 text-slate-500' },
  pending: { label: '待签署', className: 'bg-amber-500/10 text-amber-500' },
  signed: { label: '已签署', className: 'bg-emerald-500/10 text-emerald-500' },
  completed: { label: '已完成', className: 'bg-blue-500/10 text-blue-500' },
  cancelled: { label: '已取消', className: 'bg-red-500/10 text-red-500' },
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = contracts.filter(
    (c) => c.name.includes(search) || c.customerName.includes(search)
  );

  const handleDelete = (id: string) => {
    setContracts((prev) => prev.filter((c) => c.id !== id));
  };

  const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">合同管理</h1>
          <p className="text-muted-foreground">管理销售合同与协议</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增合同
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>新增合同</DialogTitle>
              <DialogDescription>填写合同基本信息</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>合同名称</Label>
                <Input placeholder="请输入合同名称" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>客户</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择客户" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockContracts.map(c => (
                        <SelectItem key={c.customerId} value={c.customerId}>{c.customerName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>合同金额</Label>
                  <Input type="number" placeholder="请输入金额" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="pending">待签署</SelectItem>
                    <SelectItem value="signed">已签署</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="mt-2">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: '合同总数', value: contracts.length, color: 'text-primary' },
          { label: '合同总额', value: `¥${(totalAmount / 10000).toFixed(1)}万`, color: 'text-emerald-500' },
          { label: '已签署', value: contracts.filter(c => c.status === 'signed').length, color: 'text-emerald-500' },
          { label: '待签署', value: contracts.filter(c => c.status === 'pending').length, color: 'text-amber-500' },
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
              <CardTitle>合同列表</CardTitle>
              <CardDescription>共 {filtered.length} 份合同</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索合同名称..."
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
                <TableHead>合同名称</TableHead>
                <TableHead>客户</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>签署日期</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((contract) => {
                const status = statusConfig[contract.status];
                return (
                  <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{contract.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{contract.customerName}</TableCell>
                    <TableCell className="font-mono font-medium">
                      ¥{contract.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contract.signedAt || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {contract.createdAt}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(contract.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
