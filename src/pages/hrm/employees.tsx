import { useState } from 'react';
import { mockEmployees, Employee } from '@/lib/mock-data';
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
import { Search, Plus, MoreHorizontal, Edit, Trash2, UserRound, Mail, Phone } from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: '在职', className: 'bg-emerald-500/10 text-emerald-500' },
  inactive: { label: '休假', className: 'bg-amber-500/10 text-amber-500' },
  resigned: { label: '离职', className: 'bg-slate-500/10 text-slate-500' },
};

const departments = ['销售部', '采购部', '人力资源部', '仓储部', '财务部', '技术部', '市场部', '客服部'];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = employees.filter(
    (e) => e.name.includes(search) || e.department.includes(search) || e.employeeNo.includes(search)
  );

  const handleDelete = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">员工管理</h1>
          <p className="text-muted-foreground">管理企业员工信息和档案</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增员工
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>新增员工</DialogTitle>
              <DialogDescription>填写员工基本信息</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>姓名</Label>
                  <Input placeholder="请输入姓名" />
                </div>
                <div className="space-y-2">
                  <Label>工号</Label>
                  <Input placeholder="自动生成" disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>部门</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>职位</Label>
                  <Input placeholder="请输入职位" />
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
              <Button className="mt-2">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: '员工总数', value: employees.length, color: 'text-primary' },
          { label: '在职', value: employees.filter(e => e.status === 'active').length, color: 'text-emerald-500' },
          { label: '部门数', value: [...new Set(employees.map(e => e.department))].length, color: 'text-blue-500' },
          { label: '本月入职', value: 2, color: 'text-amber-500' },
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
              <CardTitle>员工列表</CardTitle>
              <CardDescription>共 {filtered.length} 名员工</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索员工姓名、部门..."
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
                <TableHead>员工信息</TableHead>
                <TableHead>工号</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>职位</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>入职日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((emp) => {
                const status = statusConfig[emp.status];
                return (
                  <TableRow key={emp.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <UserRound className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{emp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{emp.employeeNo}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {emp.phone}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" /> {emp.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{emp.hireDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(emp.id)}>
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
