import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import type { PredictionData } from '../lib/mockData'

interface PredictionChartProps {
  data: PredictionData
}

const mainChartConfig = {
  actual: {
    label: 'Actual Price',
    color: 'var(--chart-1)',
  },
  predicted: {
    label: 'Predicted Price',
    color: 'var(--chart-2)',
  },
}

const errorChartConfig = {
  error: {
    label: 'Error Amount',
    color: 'var(--chart-3)',
  },
}

export function PredictionChart({ data }: PredictionChartProps) {

  const enrichedData = data.chartData.map(d => ({
    ...d,
    error: Math.abs(d.actual - d.predicted),
  }))

  const rmse = Math.sqrt(
    enrichedData.reduce((acc, curr) => acc + Math.pow(curr.error, 2), 0) / enrichedData.length
  )

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: data.currency || 'USD',
  })

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Price vs Date</CardTitle>
          <CardDescription>
            Comparing actual vs predicted stock prices for {data.stockName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={mainChartConfig} className="h-[400px] w-full">
            <LineChart
              data={enrichedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={40}
                className="text-xs"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                tickFormatter={(value) => formatter.format(value)}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }}
                    formatter={(value, name) => {
                      const label = name === 'actual' ? 'Actual' : 'Predicted'
                      return [formatter.format(Number(value)), label]
                    }}
                  />
                }
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => (value === 'actual' ? 'Actual Price' : 'Predicted Price')}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="var(--color-actual)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="var(--color-predicted)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Prediction Error</CardTitle>
          <CardDescription>
            Absolute difference between actual and predicted prices (RMSE: {formatter.format(rmse)})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={errorChartConfig} className="h-[250px] w-full">
            <LineChart
              data={enrichedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={40}
                className="text-xs"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                tickFormatter={(value) => formatter.format(value)}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }}
                    formatter={(value) => {
                      return [`${formatter.format(Number(value))} `, 'Error Amount']
                    }}
                  />
                }
              />
              <ReferenceLine
                y={rmse}
                stroke="var(--chart-4)"
                strokeDasharray="3 3"
                label={{ position: 'top', value: 'RMSE', fill: 'var(--foreground)', fontSize: 12, fontWeight: 'bold' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={() => 'Prediction Error'}
              />
              <Line
                type="monotone"
                dataKey="error"
                stroke="var(--color-error)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
