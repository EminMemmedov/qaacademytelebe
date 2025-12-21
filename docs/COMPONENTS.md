# UI Components Library

## 📦 Установленные компоненты

### Базовые компоненты
- ✅ Button
- ✅ Card
- ✅ Input
- ✅ FormField & Textarea
- ✅ Badge
- ✅ Modal
- ✅ EmptyState
- ✅ Skeleton (+ пресеты)
- ✅ BottomNav

---

## 🎨 Button

### Варианты
```tsx
import { Button } from "@/components/ui";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
```

### Размеры
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### С иконками и loading
```tsx
import { Plus, ArrowRight } from "lucide-react";

<Button leftIcon={<Plus className="w-4 h-4" />}>
  Добавить
</Button>

<Button 
  rightIcon={<ArrowRight className="w-4 h-4" />}
  isLoading={isSubmitting}
>
  Продолжить
</Button>
```

---

## 🎴 Card

### Базовое использование
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui";

<Card hover>
  <CardHeader>
    <CardTitle>Заголовок</CardTitle>
    <CardDescription>Описание карточки</CardDescription>
  </CardHeader>
  <CardContent>
    Контент
  </CardContent>
  <CardFooter>
    <Button>Действие</Button>
  </CardFooter>
</Card>
```

### Варианты
```tsx
<Card variant="default">Default</Card>
<Card variant="bordered">Bordered</Card>
<Card variant="elevated">Elevated</Card>
```

---

## 📝 Input & FormField

### Простой Input
```tsx
import { Input } from "@/components/ui";
import { Mail } from "lucide-react";

<Input
  type="email"
  label="Email"
  placeholder="your@email.com"
  leftIcon={<Mail className="w-4 h-4" />}
  error="Неверный формат email"
  required
/>
```

### С react-hook-form
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField } from "@/components/ui";

const schema = z.object({
  email: z.string().email("Неверный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        error={errors.email?.message}
        registration={register("email")}
      />
      
      <FormField
        type="password"
        label="Пароль"
        error={errors.password?.message}
        registration={register("password")}
      />
      
      <Button type="submit">Войти</Button>
    </form>
  );
}
```

### Textarea
```tsx
import { Textarea } from "@/components/ui";

<Textarea
  label="Комментарий"
  rows={4}
  placeholder="Введите текст..."
  error={errors.comment?.message}
/>
```

---

## 🏷️ Badge

### Варианты
```tsx
import { Badge } from "@/components/ui";

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="secondary">Secondary</Badge>
```

### С точкой (dot)
```tsx
<Badge variant="success" dot>Активен</Badge>
<Badge variant="error" dot>Ошибка</Badge>
```

### Размеры
```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

---

## 🪟 Modal

### Базовое использование
```tsx
import { useState } from "react";
import { Modal, ModalFooter, Button } from "@/components/ui";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Открыть модалку
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Заголовок модалки"
        description="Описание того, что делает эта модалка"
        size="md"
      >
        <p>Контент модалки</p>
        
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Отмена
          </Button>
          <Button variant="primary">
            Сохранить
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### Размеры
```tsx
<Modal size="sm">...</Modal>
<Modal size="md">...</Modal>
<Modal size="lg">...</Modal>
<Modal size="xl">...</Modal>
<Modal size="full">...</Modal>
```

### Фичи
- ✅ Закрытие по Escape
- ✅ Блокировка скролла body
- ✅ Клик вне модалки закрывает
- ✅ Анимации входа/выхода
- ✅ Кнопка закрытия (опционально)

---

## 🗑️ EmptyState

### Использование
```tsx
import { EmptyState } from "@/components/ui";
import { FileText } from "lucide-react";

<EmptyState
  icon={FileText}
  title="Нет заданий"
  description="Пока что нет ни одного задания. Создайте первое задание для студентов."
  action={{
    label: "Создать задание",
    onClick: () => router.push("/create"),
  }}
/>
```

---

## 💀 Skeleton Loaders

### Базовый Skeleton
```tsx
import { Skeleton } from "@/components/ui";

<Skeleton className="h-4 w-full" />
<Skeleton className="h-10 w-32 rounded-full" />
```

### Готовые пресеты
```tsx
import { CardSkeleton, TableRowSkeleton, ListItemSkeleton } from "@/components/ui";

// Для карточек
<div className="grid grid-cols-3 gap-4">
  <CardSkeleton />
  <CardSkeleton />
  <CardSkeleton />
</div>

// Для таблиц
<table>
  <tbody>
    <TableRowSkeleton />
    <TableRowSkeleton />
    <TableRowSkeleton />
  </tbody>
</table>

// Для списков
<div className="space-y-4">
  <ListItemSkeleton />
  <ListItemSkeleton />
  <ListItemSkeleton />
</div>
```

---

## 📱 BottomNav (Mobile)

### Использование
```tsx
import { BottomNav } from "@/components/layout/bottom-nav";
import { Home, BookOpen, FileText, User } from "lucide-react";

const navItems = [
  { name: "Главная", href: "/dashboard", icon: Home },
  { name: "Уроки", href: "/dashboard/lessons", icon: BookOpen },
  { name: "Задания", href: "/dashboard/assignments", icon: FileText, badge: 3 },
  { name: "Профиль", href: "/dashboard/profile", icon: User },
];

<BottomNav items={navItems} />
```

### Фичи
- ✅ Автоматически скрывается на desktop (lg+)
- ✅ Анимированный active indicator
- ✅ Badge для уведомлений
- ✅ Safe area support для iOS

---

## 🎨 Типографика

### Заголовки
```tsx
<h1 className="heading-1">Heading 1</h1>
<h2 className="heading-2">Heading 2</h2>
<h3 className="heading-3">Heading 3</h3>
<h4 className="heading-4">Heading 4</h4>
<h5 className="heading-5">Heading 5</h5>
```

### Текст
```tsx
<p className="body-large">Большой текст</p>
<p className="body">Обычный текст</p>
<p className="body-small">Маленький текст</p>
<p className="caption">Подпись</p>
```

### Градиенты
```tsx
<span className="text-gradient-primary">Emerald градиент</span>
<span className="text-gradient-secondary">Blue градиент</span>
<span className="text-gradient-accent">Amber градиент</span>
```

### Ссылки
```tsx
<a href="#" className="link">Обычная ссылка</a>
<a href="#" className="link-subtle">Тонкая ссылка</a>
```

---

## 🎯 Best Practices

### 1. Всегда используйте компоненты вместо нативных элементов
```tsx
// ❌ Плохо
<button className="...">Click me</button>

// ✅ Хорошо
<Button>Click me</Button>
```

### 2. Используйте семантические варианты
```tsx
// ✅ Хорошо
<Button variant="danger" onClick={handleDelete}>
  Удалить
</Button>

<Badge variant="success">Активен</Badge>
```

### 3. Добавляйте loading states
```tsx
<Button isLoading={isSubmitting} disabled={isSubmitting}>
  Сохранить
</Button>
```

### 4. Используйте EmptyState вместо простого текста
```tsx
// ❌ Плохо
{items.length === 0 && <p>Нет элементов</p>}

// ✅ Хорошо
{items.length === 0 && (
  <EmptyState
    icon={FileText}
    title="Нет элементов"
    description="Добавьте первый элемент"
  />
)}
```

### 5. Всегда показывайте Skeleton при загрузке
```tsx
{isLoading ? (
  <CardSkeleton />
) : (
  <Card>...</Card>
)}
```

---

## 🚀 Следующие шаги

### Планируется добавить:
- [ ] Select / Dropdown
- [ ] Checkbox & Radio
- [ ] Switch / Toggle
- [ ] Tabs
- [ ] Tooltip
- [ ] Avatar
- [ ] Alert / Notification
- [ ] Progress Bar
- [ ] DataTable
- [ ] DatePicker
- [ ] Accordion

---

## 📚 Ресурсы

- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Lucide Icons](https://lucide.dev/)
