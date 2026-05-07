# Photo Booth Drag & Sticker Improvements Design

**Date:** 2026-05-08  
**Project:** SryPhotoBox - Happi Booth  
**Status:** Approved

## Overview

Transform the photo booth application into a professional-grade experience by adding drag-to-reorder functionality for photos and flexible sticker attachment modes. Users will be able to intuitively reorder their photos through drag-and-drop interactions and choose whether stickers attach to individual photos or the overall strip.

## Problem Statement

Current limitations:
1. **Photos cannot be dragged** - Users can only reorder photos using small up/down arrow buttons that appear on hover, which is not intuitive
2. **Stickers don't stick to photos** - Stickers are positioned absolutely on the strip container, not attached to individual photos, so they don't move when photos are reordered
3. **Limited flexibility** - No option to choose between sticker attachment modes

## Goals

1. Enable drag-and-drop reordering of photos with visual feedback
2. Implement sticker attachment modes: "Stick to Photo" and "Stick to Strip"
3. Maintain smooth animations and professional UX
4. Support both desktop and touch devices
5. Preserve existing functionality (themes, filters, borders, layouts)

## User Experience

### Photo Drag-to-Reorder
- User hovers over a photo → cursor changes to grab/move cursor
- User clicks and drags photo → photo lifts with shadow effect
- As user drags → drop indicators appear between other photos showing where it will land
- User releases → photo smoothly animates to new position
- Other photos shift to accommodate the reordered photo

### Sticker Modes
- **Stick to Photo Mode** (default):
  - Stickers are attached to individual photos
  - When photo is reordered, stickers move with it
  - Sticker coordinates are relative to the photo frame
  - Each photo has its own sticker collection

- **Stick to Strip Mode**:
  - Stickers are positioned on the overall strip background
  - Stickers stay in place when photos are reordered
  - Sticker coordinates are relative to the strip container
  - All stickers are in a single collection

- Toggle button allows switching between modes
- Visual indicator shows current mode

## Technical Architecture

### Dependencies

**New:**
- `@dnd-kit/core` - Core drag-and-drop functionality
- `@dnd-kit/sortable` - Sortable list utilities
- `@dnd-kit/utilities` - Helper functions

**Existing:**
- `react-draggable` - Keep for sticker dragging (already in use)

### Data Structure Changes

**Current Structure:**
```typescript
// page.tsx
const [photos, setPhotos] = useState<string[]>([]);
const [stickers, setStickers] = useState<Sticker[]>([]);
```

**New Structure:**
```typescript
// page.tsx
interface PhotoWithStickers {
  id: string;
  src: string;
  stickers: Sticker[];
}

const [photos, setPhotos] = useState<PhotoWithStickers[]>([]);
const [stripStickers, setStripStickers] = useState<Sticker[]>([]);
const [stickerMode, setStickerMode] = useState<'photo' | 'strip'>('photo');
```

**Sticker Interface Update:**
```typescript
// PhotoStrip.tsx
export interface Sticker {
  id: string;
  emoji: string;
  x: number;  // percentage (0-100)
  y: number;  // percentage (0-100)
  size: StickerSize;
  rotation: number;
  opacity: number;
}
```

### Component Changes

#### 1. **page.tsx** (Main Component)
- Update state to use `PhotoWithStickers[]` instead of `string[]`
- Add `stickerMode` state
- Add `stripStickers` state for strip mode
- Update `handlePhotoTaken` to create photo objects with IDs
- Update `addSticker` to add to correct location based on mode
- Implement `handleReorderPhotos` callback
- Pass new props to PhotoStrip component

#### 2. **PhotoStrip.tsx** (Photo Display)
- Wrap photo grid with `SortableContext` from @dnd-kit
- Create `SortablePhotoItem` component for each photo
- Add drag handles and visual feedback
- Render stickers based on mode:
  - Photo mode: render stickers inside each photo container
  - Strip mode: render stickers on strip container (current behavior)
- Add drop zone indicators
- Update sticker positioning logic

#### 3. **StickerPicker.tsx** (Sticker Selection)
- Add mode toggle UI (button or switch)
- Update to pass mode information when adding stickers
- Visual indicator for current mode

#### 4. **New: SortablePhotoItem.tsx**
- Wraps individual photo with sortable functionality
- Handles drag events
- Shows drag overlay/ghost
- Manages photo-specific stickers in photo mode

### Drag-and-Drop Implementation

Using `@dnd-kit/sortable`:

```typescript
// PhotoStrip.tsx
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';

function PhotoStrip({ photos, onReorder, ... }) {
  const strategy = layout === 'vertical' 
    ? verticalListSortingStrategy 
    : horizontalListSortingStrategy;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex(p => p.id === active.id);
      const newIndex = photos.findIndex(p => p.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={photos.map(p => p.id)} strategy={strategy}>
        {photos.map(photo => (
          <SortablePhotoItem key={photo.id} photo={photo} ... />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

### Sticker Positioning Logic

**Photo Mode:**
- Stickers positioned relative to photo container
- Coordinates: percentage-based (0-100%)
- Stored in `photo.stickers[]`
- Rendered inside photo wrapper

**Strip Mode:**
- Stickers positioned relative to strip container
- Coordinates: percentage-based (0-100%)
- Stored in `stripStickers[]`
- Rendered on strip background layer

**Coordinate Conversion:**
When switching modes, convert coordinates:
```typescript
// Photo → Strip: add photo offset
stripX = photoX * (photoWidth / stripWidth) + photoOffsetX
stripY = photoY * (photoHeight / stripHeight) + photoOffsetY

// Strip → Photo: subtract photo offset
photoX = (stripX - photoOffsetX) * (stripWidth / photoWidth)
photoY = (stripY - photoOffsetY) * (stripHeight / photoHeight)
```

### Migration Strategy

Handle existing sessions gracefully:
1. Check if photos are strings or objects
2. Convert string[] to PhotoWithStickers[] on load
3. Migrate existing stickers to photo mode by default
4. Preserve backward compatibility

## UI/UX Details

### Visual Feedback

**During Drag:**
- Dragged photo: elevated shadow, slight scale (1.05x), reduced opacity (0.8)
- Drop zones: blue dashed border indicator between photos
- Other photos: shift smoothly to show new order
- Cursor: changes to grabbing cursor

**Sticker Mode Toggle:**
- Icon button with two states:
  - 📌 "Stick to Photo" (pin icon)
  - 📋 "Stick to Strip" (clipboard icon)
- Tooltip on hover explaining mode
- Highlight active mode with accent color

**Accessibility:**
- Keyboard support for reordering (arrow keys)
- Screen reader announcements for drag actions
- Focus indicators on draggable elements

### Animations

- Photo reorder: 300ms ease-out transition
- Sticker mode switch: 200ms fade transition
- Drop indicator: 150ms fade in/out
- Drag lift: 200ms cubic-bezier

## Edge Cases & Error Handling

1. **Drag during photo session** - Disable drag when `isSessionActive === true`
2. **Drag during retake** - Disable drag when `retakeIndex !== null`
3. **Mode switch with stickers** - Prompt user or auto-convert coordinates
4. **Empty photos** - No drag functionality shown
5. **Single photo** - Drag handle visible but no reorder possible
6. **Touch devices** - Ensure touch events work properly with @dnd-kit
7. **Download with stickers** - Ensure stickers render correctly in exported image

## Testing Checklist

- [ ] Drag photo up/down in vertical layout
- [ ] Drag photo left/right in landscape layout
- [ ] Drag photo in grid layout (2x2)
- [ ] Drop indicators appear correctly
- [ ] Photos animate smoothly to new positions
- [ ] Stickers stay with photo in "photo mode"
- [ ] Stickers stay on strip in "strip mode"
- [ ] Toggle between modes works
- [ ] Add sticker in photo mode attaches to correct photo
- [ ] Add sticker in strip mode positions on strip
- [ ] Reorder photos with stickers attached
- [ ] Download includes all stickers in correct positions
- [ ] Touch drag works on mobile devices
- [ ] Keyboard navigation works
- [ ] Drag disabled during photo session
- [ ] Drag disabled during retake
- [ ] Multiple rapid reorders don't break state

## Performance Considerations

- Use `React.memo` for SortablePhotoItem to prevent unnecessary re-renders
- Debounce drag events if performance issues arise
- Use CSS transforms for animations (GPU-accelerated)
- Lazy load @dnd-kit only when photos exist
- Keep sticker arrays immutable for efficient React updates

## Future Enhancements (Out of Scope)

- Pinch-to-zoom photos
- Rotate individual photos
- Sticker rotation controls
- Sticker opacity controls
- Undo/redo for reordering
- Multi-select photos for batch operations
- Copy stickers between photos
- Sticker library/favorites

## Success Metrics

- Users can reorder photos intuitively without instructions
- Sticker attachment behaves as expected in both modes
- No performance degradation with 4 photos + 10 stickers
- Touch devices work as smoothly as desktop
- Zero crashes or state corruption during drag operations

## Implementation Plan

Will be created in next phase using writing-plans skill.
