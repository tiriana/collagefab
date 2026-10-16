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

// Expanded, 4 buttons at gap 14 occupy 4 * 56 + 3 * 14; collapsed they occupy 56.
const FAN_EXTENT = 266;
const BUTTON_EXTENT = 56;

// The root grows in place, so each card reserves the full expanded extent and
// pins the root to the anchor edge with `justifyContent`; otherwise the fan-out
// would push the card around instead of unfolding into the reserved space.
const DIRECTION_DEMOS: Array<{
  value: CollageFabDirection;
  caption: string;
  horizontal: boolean;
  justifyContent: 'flex-start' | 'flex-end';
}> = [
  { value: 'left', caption: 'Pins right, fans left', horizontal: true, justifyContent: 'flex-end' },
  { value: 'right', caption: 'Pins left, fans right', horizontal: true, justifyContent: 'flex-start' },
  { value: 'up', caption: 'Pins bottom, fans up', horizontal: false, justifyContent: 'flex-end' },
  { value: 'down', caption: 'Pins top, fans down', horizontal: false, justifyContent: 'flex-start' },
];

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
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end', // Aligns the anchor to the right
                minHeight: 200,
                justifyContent: 'space-between',
                background: 'linear-gradient(145deg, #232323 0%, #1a1a1a 100%)'
              }}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" fontWeight="bold" color="grey.300">
                  {count} Button{count > 1 ? 's' : ''}
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.600', maxWidth: 100, textAlign: 'right' }}>
                  {count === 7 ? 'Limits of visual clarity' : count === 1 ? 'Standard Fab bypass' : 'Perfect slice split'}
                </Typography>
              </Box>

              {/* The Component Instance */}
              <Box sx={{ pb: 1, pr: 1 }}>
                <CollageFab gap={14} fadeWidth={12}>
                  {MOCK_TOOLS.slice(0, count).map((tool, idx) => (
                    <Fab
                      key={idx}
                      sx={{
                        bgcolor: tool.color,
                        color: 'white',
                        '&:hover': { bgcolor: tool.color, filter: 'brightness(1.2)' }
                      }}
                    >
                      {tool.icon}
                    </Fab>
                  ))}
                </CollageFab>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight="bold" color="white" align="center" mt={8} mb={4}>
        Direction
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {DIRECTION_DEMOS.map((demo) => (
          <Grid item xs={12} md={6} lg={4} key={`direction-${demo.value}`}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end', // Aligns the anchor to the right
                minHeight: 200,
                justifyContent: 'space-between',
                background: 'linear-gradient(145deg, #232323 0%, #1a1a1a 100%)'
              }}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" fontWeight="bold" color="grey.300">
                  {demo.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.600', maxWidth: 100, textAlign: 'right' }}>
                  {demo.caption}
                </Typography>
              </Box>

              {/* Reserves the full expanded extent so the fan-out never pushes the card. */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: demo.horizontal ? 'row' : 'column',
                  justifyContent: demo.justifyContent,
                  minWidth: demo.horizontal ? FAN_EXTENT : BUTTON_EXTENT,
                  minHeight: demo.horizontal ? BUTTON_EXTENT : FAN_EXTENT,
                  overflow: 'visible',
                }}
              >
                <CollageFab direction={demo.value} gap={14} fadeWidth={12}>
                  {MOCK_TOOLS.slice(0, 4).map((tool, idx) => (
                    <Fab
                      key={idx}
                      sx={{
                        bgcolor: tool.color,
                        color: 'white',
                        '&:hover': { bgcolor: tool.color, filter: 'brightness(1.2)' }
                      }}
                    >
                      {tool.icon}
                    </Fab>
                  ))}
                </CollageFab>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
