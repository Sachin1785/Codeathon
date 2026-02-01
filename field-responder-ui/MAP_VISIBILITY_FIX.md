# 🎯 MAJOR FIX: Map No Longer Covered by Bottom Sheet

## The Problem:
The bottom sheet was covering the entire map, making it impossible to see the map on mobile devices.

## The Solution:

### 1. **Redesigned Layout Structure** (`mission-view.tsx`)

**Before:**
- Map had fixed height `h-[40vh]`
- Bottom sheet was `h-auto` (took all available space)
- Everything competed for space

**After:**
- Header: `flex-shrink-0` (fixed size)
- Map: `flex-1` (takes ALL remaining space above bottom sheet)
- Bottom sheet: Fixed at bottom with **peek mode**

### 2. **Peek Mode Bottom Sheet** (`mission-briefing.tsx`)

**Collapsed State:**
- Height: `80px` (just shows the header)
- Only displays incident title and reporter
- Map is FULLY VISIBLE above it

**Expanded State:**
- Height: `calc(100vh - 12rem)` (almost full screen)
- Shows all incident details, notes, and checklist
- User taps to expand/collapse

**Key Changes:**
```tsx
// Collapsed: h-[80px]
// Expanded: h-[calc(100vh-12rem)]
${isExpanded ? "h-[calc(100vh-12rem)]" : "h-[80px]"}
```

### 3. **Content Visibility**

**Before:**
- All content always rendered (caused overflow)

**After:**
- Only header visible when collapsed
- Content only renders when expanded:
```tsx
{isExpanded && (
  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
    {/* All content here */}
  </div>
)}
```

## Visual Result:

### Collapsed (Default):
```
┌─────────────────┐
│  Header         │ ← Fixed
├─────────────────┤
│                 │
│      MAP        │ ← Takes all space
│   (VISIBLE!)    │
│                 │
├─────────────────┤
│ Incident Title  │ ← 80px peek
│ Tap to expand ▲ │
├─────────────────┤
│  Bottom Nav     │ ← Fixed
└─────────────────┘
```

### Expanded:
```
┌─────────────────┐
│  Header         │ ← Fixed
├─────────────────┤
│                 │
│   Small MAP     │ ← Compressed but visible
│                 │
├─────────────────┤
│ Incident Title  │
│ Tap to close ▼  │
├─────────────────┤
│                 │
│  Full Details   │
│  Notes          │
│  Checklist      │
│  (Scrollable)   │
│                 │
├─────────────────┤
│  Bottom Nav     │
└─────────────────┘
```

## Technical Details:

### Layout Flow:
1. **Header**: `flex-shrink-0 z-40` - Never shrinks, stays on top
2. **Map**: `flex-1 overflow-hidden` - Grows to fill space
3. **Bottom Sheet**: `fixed bottom-16` - Anchored at bottom

### Responsive Behavior:
- Map automatically adjusts to available space
- Bottom sheet peek is always 80px
- Expanded sheet is `100vh - 12rem` (accounts for header + nav)
- Smooth transitions with `duration-300 ease-out`

## Files Changed:

1. **`components/mission-view.tsx`**
   - Removed fixed map height
   - Changed to flexbox layout
   - Map now uses `flex-1`

2. **`components/mission-briefing.tsx`**
   - Added peek mode (80px collapsed)
   - Conditional content rendering
   - Fixed height calculations

## Result:

✅ **Map is ALWAYS visible**
✅ **Bottom sheet peeks at 80px**
✅ **Tap to expand for full details**
✅ **Smooth animations**
✅ **Proper responsive behavior**
✅ **No more overflow issues**

## Deploy:

```bash
git add .
git commit -m "Fix map visibility with peek mode bottom sheet"
git push
```

**The map is now fully visible on your phone!** 🗺️✨
