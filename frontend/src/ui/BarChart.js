import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  HorizontalGridLines
} from 'react-vis';

const BarChart = ({ data, axisCategory2Label, theme }) => {
  const maxY = Math.max(...data.map(({ y }) => y));
  const nTicks = maxY > 10 ? 10 : maxY > 5 ? 5 : maxY;
  // see https://github.com/uber/react-vis/issues/671 for discussion of what
  // to do with overlapping labels, i.e.
  // tickLabelAngle={-90} and enhanced bottom margin
  const tickFormatter = d => {
    const s = axisCategory2Label[d];
    return s.length > 10 ? s.substr(0, 10) + '...' : s;
  };

  const atLeastSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const margin = { left: 40 };
  if (!atLeastSmall) margin.bottom = 100;

  // includes work-around for https://github.com/uber/react-vis/issues/1143
  return (
    <FlexibleXYPlot
      xType={'ordinal'}
      animation={true}
      margin={margin}
      colorType={'category'}
    >
      <HorizontalGridLines />
      <VerticalBarSeries data={data} stack={false} />
      <XAxis
        tickFormat={tickFormatter}
        tickLabelAngle={atLeastSmall ? 0 : -90}
        style={{
          text: theme.typography.body2
        }}
      />
      <YAxis
        tickTotal={nTicks}
        style={{
          text: theme.typography.body2
        }}
      />
    </FlexibleXYPlot>
  );
};

export default withTheme()(BarChart);
