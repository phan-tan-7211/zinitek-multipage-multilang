# SKILL.md — Hướng dẫn Kỹ thuật UX Tương tác Cao cấp (Pro Max)

Tài liệu này mô tả chi tiết các kỹ thuật UX đã được triển khai trong dự án **Zinitek**. Mục đích: bất kỳ ai đọc file này đều hiểu **tại sao** và **làm thế nào** để tái tạo lại các tính năng này.

---

## 1. MOUSE DRAG SCROLL — Kéo chuột để cuộn ngang (PC Desktop)

### Vấn đề
Trên Laptop/Mobile, người dùng có thể vuốt ngón tay để cuộn ngang thanh lọc (Filter Chips). Nhưng trên Desktop PC chỉ có chuột — không thể cuộn ngang bằng scroll wheel thông thường (phải giữ Shift). Điều này gây khó chịu.

### Giải pháp
Thêm sự kiện `mousedown`, `mousemove`, `mouseup`, `mouseleave` để cho phép người dùng **nhấn giữ và kéo ngang** container, giống thao tác native trên ứng dụng di động.

### Code Pattern (TypeScript/React)

```tsx
// Trong component (Client Component):
const scrollContainerRef = useRef<HTMLDivElement>(null)
const isDragging = useRef(false)
const wasDragging = useRef(false)  // Phân biệt drag vs click
const startX = useRef(0)
const scrollLeft = useRef(0)

const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = scrollContainerRef.current
  if (!el) return
  isDragging.current = true
  wasDragging.current = false      // Reset mỗi lần bắt đầu
  startX.current = e.pageX - el.offsetLeft
  scrollLeft.current = el.scrollLeft
  el.style.cursor = 'grabbing'
  el.style.userSelect = 'none'
}

const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!isDragging.current || !scrollContainerRef.current) return
  e.preventDefault()
  const el = scrollContainerRef.current
  const walk = (e.pageX - el.offsetLeft - startX.current) * 1.5  // 1.5 = tốc độ kéo
  if (Math.abs(walk) > 3) wasDragging.current = true  // Ngưỡng 3px để phát hiện kéo thật
  el.scrollLeft = scrollLeft.current - walk
}

const onMouseUp = () => {
  isDragging.current = false
  if (scrollContainerRef.current) {
    scrollContainerRef.current.style.cursor = 'grab'
    scrollContainerRef.current.style.userSelect = ''
  }
}
const onMouseLeave = () => { if (isDragging.current) onMouseUp() }

// Trong JSX:
<div
  ref={scrollContainerRef}
  className="flex overflow-x-auto scrollbar-hide cursor-grab select-none"
  onMouseDown={onMouseDown}
  onMouseMove={onMouseMove}
  onMouseUp={onMouseUp}
  onMouseLeave={onMouseLeave}
>
  {/* Các nút chip ở đây */}
  <button
    onClick={() => { if (!wasDragging.current) doSomething() }}  // QUAN TRỌNG: kiểm tra wasDragging
  >
    Chip
  </button>
</div>
```

### ⚠️ Chú ý quan trọng: Chống click nhầm sau khi kéo
Sau khi kéo xong và thả chuột, trình duyệt vẫn gọi sự kiện `onClick`. Phải dùng `wasDragging.current` để bỏ qua click đó:

```tsx
onClick={() => { if (!wasDragging.current) setActiveCategory(id) }}
```

### Files đã áp dụng
- `components/product-list-content.tsx`
- `components/portfolio-list-content.tsx`

---

## 2. ZONE-AWARE SWIPE — Vuốt thông minh, phân biệt vùng (như TikTok/Facebook)

### Vấn đề
Trang web có `SmartSwipeWrapper` bắt sự kiện vuốt ngang để chuyển trang. Nhưng trang chủ có Carousel và Filter Chips cũng cần vuốt ngang. Nếu không xử lý, vuốt vào Carousel sẽ bị SmartSwipeWrapper chặn và chuyển trang thay vì cuộn Carousel.

### Giải pháp: 2 tầng bảo vệ

#### Tầng 1: CSS `overflow` auto-detect
`SmartSwipeWrapper` kiểm tra xem điểm bắt đầu touch có nằm trong một container `overflow-x: scroll/auto` không. Nếu có → nhường quyền cho container đó.

```ts
function isInsideHorizontalScroller(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false
  let el: Element | null = target
  while (el && el !== document.body) {
    const style = window.getComputedStyle(el)
    const overflowX = style.overflowX
    if ((overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth) return true
    if (el.getAttribute('data-swipe-zone') === 'horizontal') return true  // Tầng 2
    el = el.parentElement
  }
  return false
}
```

#### Tầng 2: `data-swipe-zone` attribute (cho Embla Carousel)
Embla Carousel dùng CSS `transform` thay vì `overflow: scroll` → Tầng 1 không detect được. Giải pháp: thêm `data-swipe-zone="horizontal"` vào root element của Carousel.

```tsx
// Đặt thẳng vào Carousel component (nó spread props vào root div):
<Carousel data-swipe-zone="horizontal" ...>

// Hoặc wrap bằng div:
<div data-swipe-zone="horizontal">
  <Carousel ...>
</div>

// Cho filter chips (overflow: scroll nên Tầng 1 đã detect, nhưng nên thêm để chắc chắn):
<div data-swipe-zone="horizontal" className="flex overflow-x-auto ...">
```

#### Cách `SmartSwipeWrapper` ghi lại điểm bắt đầu touch
Vì `useDrag` từ `@use-gesture/react` nhận event muộn hơn touch native, cần ghi lại `touchStartTarget` bằng `addEventListener` riêng:

```tsx
const touchStartTarget = useRef<EventTarget | null>(null)

useEffect(() => {
  const onTouchStart = (e: TouchEvent) => {
    touchStartTarget.current = e.target  // Lưu element bắt đầu touch
  }
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  return () => window.removeEventListener('touchstart', onTouchStart)
}, [])

// Trong useDrag callback:
const startTarget = touchStartTarget.current || (event as TouchEvent)?.target
if (isInsideHorizontalScroller(startTarget)) return  // Bỏ qua, nhường cho Carousel
```

### Luồng quyết định hoàn chỉnh

```
Người dùng bắt đầu vuốt
        ↓
ghi touchStartTarget vào ref
        ↓
useDrag callback kích hoạt
        ↓
isInsideHorizontalScroller(startTarget) ?
        ↓                    ↓
      TRUE                 FALSE
(có data-swipe-zone      (vùng bình thường)
 hoặc overflow scroll)         ↓
        ↓              Kiểm tra ngưỡng px
    return (bỏ qua)    → chuyển trang
```

### Files đã áp dụng
- `components/smart-swipe-wrapper.tsx` — Logic chính
- `components/featured-projects.tsx` — `data-swipe-zone` trên Carousel
- `components/blog-carousel.tsx` — `data-swipe-zone` trên Carousel
- `components/product-list-content.tsx` — `data-swipe-zone` trên filter chips
- `components/portfolio-list-content.tsx` — `data-swipe-zone` trên filter chips

---

## 3. HORIZONTAL FILTER BAR — Thanh lọc ngang Pro Max

### Thiết kế chuẩn (áp dụng thống nhất trên Products và Portfolio)

```tsx
{/* Sticky bar */}
<div className="sticky top-0 z-40 bg-background/95 backdrop-blur pt-4 pb-5 border-b border-border/30 md:border-0">
  <div className="relative">
    {/* Gradient mờ hai đầu để gợi ý có thể cuộn */}
    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

    {/* Container cuộn ngang với mouse drag */}
    <div
      ref={scrollContainerRef}
      data-swipe-zone="horizontal"
      className="flex overflow-x-auto pb-1 gap-2 scrollbar-hide snap-x cursor-grab select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Nút Tất cả */}
      <button
        onClick={() => { if (!wasDragging.current) setActive("all") }}
        className={`flex-shrink-0 px-5 py-2 rounded-full text-[13px] font-medium snap-start border ${
          active === "all"
            ? "bg-[#f97316] text-white border-[#f97316] shadow-lg shadow-[#f97316]/20"
            : "bg-card text-muted-foreground border-border hover:border-[#f97316]/30"
        }`}
      >
        Tất cả
      </button>

      {/* Các chip danh mục */}
      {categories.map(cat => (
        <button key={cat.id} onClick={() => { if (!wasDragging.current) setActive(cat.id) }}
          className={`flex-shrink-0 px-5 py-2 rounded-full text-[13px] font-medium snap-start border ${
            active === cat.id
              ? "bg-[#f97316] text-white border-[#f97316] shadow-lg shadow-[#f97316]/20"
              : "bg-card text-muted-foreground border-border hover:border-[#f97316]/30"
          }`}
        >
          {cat.title}
        </button>
      ))}
    </div>
  </div>
</div>
```

### Giải thích các class quan trọng
| Class | Lý do |
|---|---|
| `sticky top-0 z-40` | Thanh lọc dính vào đầu màn hình khi cuộn xuống |
| `backdrop-blur bg-background/95` | Hiệu ứng kính mờ, thấy nội dung phía sau |
| `scrollbar-hide` | Ẩn thanh cuộn ngang (xấu) nhưng vẫn cuộn được |
| `snap-x` + `snap-start` | Các chip "bắt" vào vị trí đẹp khi dừng cuộn |
| `cursor-grab` | Gợi ý người dùng có thể kéo |
| `select-none` | Ngăn chọn text khi kéo chuột |
| `flex-shrink-0` | Chip không bị co lại khi container nhỏ hơn |

---

## 4. TÓM TẮT CHECKLIST — Áp dụng cho trang mới

Khi tạo một trang mới có bộ lọc ngang, cần làm đủ các bước sau:

- [ ] Thêm `useRef` cho `scrollContainerRef`, `isDragging`, `wasDragging`, `startX`, `scrollLeft`
- [ ] Thêm 4 handler: `onMouseDown`, `onMouseMove`, `onMouseUp`, `onMouseLeave`
- [ ] Gán handler và `data-swipe-zone="horizontal"` vào container cuộn
- [ ] Thêm `cursor-grab select-none` vào className container
- [ ] Thêm `if (!wasDragging.current)` vào tất cả `onClick` của chip
- [ ] Thêm gradient 2 đầu (`from-background to-transparent`) để gợi ý cuộn
- [ ] Thêm `sticky top-0 z-40` nếu muốn thanh lọc cố định khi cuộn

Nếu trong trang có **Embla Carousel**, thêm `data-swipe-zone="horizontal"` vào `<Carousel>` component.

---

*Cập nhật lần cuối: 2026-05-14 | Dự án: Zinitek High-tech Precision Web*
