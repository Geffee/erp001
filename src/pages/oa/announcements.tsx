import { useState } from 'react';
import { mockAnnouncements, Announcement } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Pin, Megaphone, Calendar, Bell } from 'lucide-react';

const typeConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  notice: { label: '通知', icon: Bell, className: 'bg-blue-500/10 text-blue-500' },
  policy: { label: '政策', icon: Megaphone, className: 'bg-purple-500/10 text-purple-500' },
  event: { label: '活动', icon: Calendar, className: 'bg-emerald-500/10 text-emerald-500' },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = announcements.filter(
    (a) => a.title.includes(search) || a.content.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">通知公告</h1>
          <p className="text-muted-foreground">发布和管理公司通知与政策</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              发布公告
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>发布公告</DialogTitle>
              <DialogDescription>填写公告内容</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>标题</Label>
                <Input placeholder="请输入公告标题" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>类型</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notice">通知</SelectItem>
                      <SelectItem value="policy">政策</SelectItem>
                      <SelectItem value="event">活动</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>发布人</Label>
                  <Input placeholder="系统管理员" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>内容</Label>
                <Textarea placeholder="请输入公告内容" rows={4} />
              </div>
              <Button className="mt-2">发布</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: '公告总数', value: announcements.length, color: 'text-primary' },
          { label: '置顶公告', value: announcements.filter(a => a.isTop).length, color: 'text-amber-500' },
          { label: '本月发布', value: 3, color: 'text-blue-500' },
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
              <CardTitle>公告列表</CardTitle>
              <CardDescription>共 {filtered.length} 条公告</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索公告标题..."
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
                <TableHead>标题</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>发布人</TableHead>
                <TableHead>发布时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ann) => {
                const type = typeConfig[ann.type];
                const TypeIcon = type.icon;
                return (
                  <TableRow
                    key={ann.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedAnn(ann); setDetailOpen(true); }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {ann.isTop && <Pin className="h-4 w-4 text-accent" />}
                        <span className="font-medium">{ann.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={type.className}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {type.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{ann.publisher}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ann.createdAt}</TableCell>
                    <TableCell>
                      {ann.isTop && (
                        <Badge className="bg-accent/10 text-accent text-xs">置顶</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
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
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedAnn?.title}</DialogTitle>
            <DialogDescription>
              {selectedAnn && typeConfig[selectedAnn.type]?.label} · {selectedAnn?.publisher} · {selectedAnn?.createdAt}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {selectedAnn?.content}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
