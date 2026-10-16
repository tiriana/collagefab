import * as React from 'react';
import { Box, Container, Fab, Grid, Paper, Typography } from '@mui/material';
import {
  Settings,
  BugReport,
  Speed,
  Code,
  Palette,
  Api,
  Terminal,
} from '@mui/icons-material';
import { CollageFab, type CollageFabDirection } from '../components/CollageFab';

const MOCK_TOOLS = [
  { icon: <Settings />, color: '#1976d2', name: 'Settings' },
  { icon: <BugReport />, color: '#9c27b0', name: 'Debugger' },
  { icon: <Speed />, color: '#ed6c02', name: 'Performance' },
  { icon: <Code />, color: '#2e7d32', name: 'Source' },
  { icon: <Palette />, color: '#e91e63', name: 'Theme' },
  { icon: <Api />, color: '#0288d1', name: 'Network' },
  { icon: <Terminal />, color: '#4caf50', name: 'Console' },
];

const BUTTON_MIN = 24;
const BUTTON_MAX = 56;
const GAP_MIN = 6;
const GAP_MAX = 14;
const GAP_RATIO = 0.25;
const CARD_MIN_HEIGHT = 200;
const DIRECTION_BUTTON_COUNT = 4;

interface RowFit {
  size: number;
  gap: number;
  extent: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Largest button diameter that keeps `count` buttons on one line inside
 * `available` px. The gap shrinks with the diameter, so a dense row on a narrow
 * card tightens up instead of spilling past the card edge.
 */
function fitRow(count: number, available: number): RowFit {
  const spans = Math.max(count - 1, 0);
  let size = BUTTON_MAX;
  let gap = GAP_MAX;
  if (available > 0) {
    for (let pass = 0; pass < 6; pass += 1) {
      size = clamp(Math.floor((available - spans * gap) / count), BUTTON_MIN, BUTTON_MAX);
      const nextGap = clamp(Math.round(size * GAP_RATIO), GAP_MIN, GAP_MAX);
      if (nextGap === gap) {
        break;
      }
      gap = nextGap;
    }
  }
  return { size, gap, extent: count * size + spans * gap };
}

function useMeasuredWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }
    const update = () => setWidth(node.clientWidth);
    update();
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

const CARD_SX = {
  p: 4,
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  background: 'linear-gradient(145deg, #232323 0%, #1a1a1a 100%)',
} as const;

function CardHeading({ title, caption }: { title: string; caption: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography variant="h6" fontWeight="bold" color="grey.300">
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color: 'grey.600', maxWidth: 100, textAlign: 'right' }}>
        {caption}
      </Typography>
    </Box>
  );
}

function CountCard({ count }: { count: number }) {
  const { ref, width } = useMeasuredWidth<HTMLDivElement>();
  const { size, gap } = fitRow(count, width);
  const caption =
    count === 7 ? 'Limits of visual clarity' : count === 1 ? 'Standard Fab bypass' : 'Perfect slice split';

  return (
    <Paper elevation={3} sx={{ ...CARD_SX, minHeight: CARD_MIN_HEIGHT }}>
      <CardHeading title={`${count} Button${count > 1 ? 's' : ''}`} caption={caption} />

      {/* Full-width stage: it is the measured box the row has to fit into, and it
          centers the stack. The bottom padding mirrors the heading so the stack
          lands on the card's centreline instead of sinking into the lower half. */}
      <Box
        ref={ref}
        sx={{
          width: '100%',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pb: 4,
        }}
      >
        <CollageFab size={size} gap={gap} fadeWidth={12}>
          {MOCK_TOOLS.slice(0, count).map((tool, idx) => (
            <Fab
              key={idx}
              sx={{
                bgcolor: tool.color,
                color: 'white',
                '&:hover': { bgcolor: tool.color, filter: 'brightness(1.2)' },
              }}
            >
              {tool.icon}
            </Fab>
          ))}
        </CollageFab>
      </Box>
    </Paper>
  );
}

interface DirectionDemo {
  value: CollageFabDirection;
  caption: string;
  horizontal: boolean;
  justifyContent: 'flex-start' | 'flex-end';
}

const DIRECTION_DEMOS: DirectionDemo[] = [
  { value: 'left', caption: 'Pins right, fans left', horizontal: true, justifyContent: 'flex-end' },
  { value: 'right', caption: 'Pins left, fans right', horizontal: true, justifyContent: 'flex-start' },
  { value: 'up', caption: 'Pins bottom, fans up', horizontal: false, justifyContent: 'flex-end' },
  { value: 'down', caption: 'Pins top, fans down', horizontal: false, justifyContent: 'flex-start' },
];

// One axis per row: the horizontal pair sits above the vertical pair, so a
// reader never compares a vertical fan against a horizontal one.
const HORIZONTAL_DEMOS = DIRECTION_DEMOS.filter((demo) => demo.horizontal);
const VERTICAL_DEMOS = DIRECTION_DEMOS.filter((demo) => !demo.horizontal);

function DirectionCard({ demo }: { demo: DirectionDemo }) {
  const { ref, width } = useMeasuredWidth<HTMLDivElement>();
  const { size, gap, extent } = fitRow(DIRECTION_BUTTON_COUNT, width);

  return (
    <Paper elevation={3} sx={CARD_SX}>
      <CardHeading title={demo.value} caption={demo.caption} />

      {/* A square stage reserves the full fan extent on both axes, so the fan-out
          never resizes the card. Every card shares the same stage, which keeps the
          four heights identical, and pins the anchor to its own edge on the main
          axis while centering it on the cross axis: left/right and up/down each
          mirror, and the two cards in a row line up. */}
      <Box
        ref={ref}
        sx={{
          width: '100%',
          height: extent,
          display: 'flex',
          flexDirection: demo.horizontal ? 'row' : 'column',
          justifyContent: demo.justifyContent,
          alignItems: 'center',
          overflow: 'visible',
        }}
      >
        <CollageFab direction={demo.value} size={size} gap={gap} fadeWidth={12}>
          {MOCK_TOOLS.slice(0, DIRECTION_BUTTON_COUNT).map((tool, idx) => (
            <Fab
              key={idx}
              sx={{
                bgcolor: tool.color,
                color: 'white',
                '&:hover': { bgcolor: tool.color, filter: 'brightness(1.2)' },
              }}
            >
              {tool.icon}
            </Fab>
          ))}
        </CollageFab>
      </Box>
    </Paper>
  );
}

function DirectionRow({ label, demos }: { label: string; demos: DirectionDemo[] }) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ color: 'grey.500', letterSpacing: '0.2em', display: 'block', mb: 2 }}
      >
        {label}
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {demos.map((demo) => (
          <Grid item xs={12} md={6} lg={6} key={`direction-${demo.value}`}>
            <DirectionCard demo={demo} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function DemoPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="900" gutterBottom align="center" color="white">
        Perfected CollageFab
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" mb={8} sx={{ maxWidth: 700, mx: 'auto' }}>
        Mathematical clipping slices overlapping circles. Simultaneous inverse translation of the
        <strong> WebkitMaskPosition</strong> against the component's <strong>translateX</strong> creates a
        flawless morphing unfold without bounds popping.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {[1, 2, 3, 4, 5, 6, 7].map((count) => (
          <Grid item xs={12} md={6} lg={4} key={`demo-${count}`}>
            <CountCard count={count} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight="bold" color="white" align="center" mt={8} mb={4}>
        Direction
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <DirectionRow label="Horizontal" demos={HORIZONTAL_DEMOS} />
        <DirectionRow label="Vertical" demos={VERTICAL_DEMOS} />
      </Box>
    </Container>
  );
}
