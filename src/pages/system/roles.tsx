import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Shield, Edit, Users, Key } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const mockRoles: Role[] = [
  { id: '1', name: '超级管理员', code: 'admin', description: '拥有系统全部权限', userCount: 1, permissions: ['全部权限'] },
  { id: '2', name: '销售经理', code: 'sales_manager', description: '管理销售业务和客户', userCount: 3, permissions: ['CRM管理', '销售管理', '报表查看'] },
  { id: '3', name: '采购主管', code: 'purchase_manager', description: '管理采购和供应链', userCount: 2, permissions: ['采购管理', '库存查看', '产品管理'] },
  { id: '4', name: 'HR经理', code: 'hr_manager', description: '管理人力资源', userCount: 2, permissions: ['HR管理', '员工档案', 'OA公告'] },
  { id: '5', name: '仓库管理员', code: 'warehouse', description: '管理仓库库存', userCount: 3, permissions: ['库存管理', '入库管理', '出库管理'] },
  { id: '6', name: '财务主管', code: 'finance', description: '管理财务核算', userCount: 2, permissions: ['财务管理', '报表查看', '合同查看'] },
  { id: '7', name: '普通用户', code: 'user', description: '基础操作权限', userCount: 5, permissions: ['OA公告查看', '个人设置'] },
];

const allPermissions = [
  '仪表盘', 'CRM管理', '合同管理', '产品管理', '采购管理', '销售管理',
  '库存管理', 'HR管理', '员工档案', 'OA公告', 'OA公告查看', '用户管理',
  '角色管理', '财务管理', '报表查看', '入库管理', '出库管理', '个人设置',
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">角色管理</h1>
          <p className="text-muted-foreground">管理系统角色与权限分配</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              新增角色
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新增角色</DialogTitle>
              <DialogDescription>设置角色基本信息和权限</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>角色名称</Label>
                  <Input placeholder="请输入角色名称" />
                </div>
                <div className="space-y-2">
                  <Label>角色编码</Label>
                  <Input placeholder="请输入编码" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>描述</Label>
                <Input placeholder="请输入角色描述" />
              </div>
              <div className="space-y-2">
                <Label>权限分配</Label>
                <div className="grid grid-cols-3 gap-3 rounded-lg border p-4">
                  {allPermissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-2">
                      <Checkbox id={`perm-${perm}`} />
                      <Label htmlFor={`perm-${perm}`} className="text-sm cursor-pointer">
                        {perm}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="mt-2">保存</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: '角色总数', value: roles.length, icon: Shield, color: 'text-primary' },
          { label: '已分配用户', value: roles.reduce((s, r) => s + r.userCount, 0), icon: Users, color: 'text-blue-500' },
          { label: '权限项数', value: allPermissions.length, icon: Key, color: 'text-amber-500' },
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
          <CardTitle>角色列表</CardTitle>
          <CardDescription>管理系统角色与对应权限</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{role.name}</CardTitle>
                        <CardDescription className="text-xs">{role.code}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">
                      <Users className="h-3 w-3 inline mr-1" />
                      {role.userCount} 个用户
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
