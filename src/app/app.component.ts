import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Chart, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // data: ChartData&lt;'doughnut'>;

  // options: ChartOptions&lt;'doughnut'>;
  data: any;
  options: any;

  constructor() {
    this.data = {
      labels: ['AAAAA', 'BBBBB', 'CCCCC'],
      datasets: [
        {
          data: [55, 25, 20],
          backgroundColor: [
            'rgb(255, 99, 132,.7)',
            'rgb(54, 162, 235,.7)',
            'rgb(255, 205, 86,.7)',
          ],
          hoverBackgroundColor: [
            'rgb(255, 99, 132,.5)',
            'rgb(54, 162, 235,.5)',
            'rgb(255, 205, 86,.5)',
          ],
          borderWidth: 1,
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          offset: 10,
        },
      ],
    };

    this.options = {
      cutout: '60%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
    };

    Chart.register({
      //https://www.youtube.com/watch?v=YcRj52VovYQ
      id: 'customLabels',
      afterDraw(chart: any, args: any, options: any) {
        const {
          ctx,
          chartArea: { left, right, top, bottom, width, height },
        } = chart;

        chart.data.datasets.forEach((dataset: any, i: any) => {
          chart.getDatasetMeta(i).data.forEach((datapoint: any, index: any) => {
            const { x, y } = datapoint.tooltipPosition(true);

            //(Lấy)Vẽ tâm của từng section fillRect(x, y, width, height)
            ctx.fillStyle = 'black'; //có thể custom màu theo màu của từng section dataset.borderColor[index] (not working???)
            //ctx.fillStyle = dataset.borderColor[index as any];
            ctx.fillRect(x, y, 2, 2);

            // Vẽ đường

            //Tính toán
            const halfwidth = width / 2;
            const halfheight = height / 2;

            const xLine = x >= halfwidth ? x + 30 : x - 30; // Vẽ hướng x của mỗi section của nửa hình tròn sao cho hướng trỏ ra ngoài
            const yLine = y >= halfheight ? y + 30 : y - 30; // Vẽ hướng y của mỗi section của nửa hình tròn sao cho hướng trỏ ra ngoài
            const extraLine = x >= halfwidth ? 100 : -100;

            //Vẽ
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(xLine, yLine);
            ctx.lineTo(xLine + extraLine, yLine);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            //Hiển thị text
            const textWidth = ctx.measureText(
              chart?.data?.labels[index] as any
            ).width;
            ctx.font = '12px Arial';

            //Vị trí text
            const textXPosition = x >= halfwidth ? 'left' : 'right';
            const plusFixPx = x >= halfwidth ? 10 : -10;
            ctx.textAlign = textXPosition;
            ctx.textBaseline = 'middle';
            // ctx.fillText(
            //   chart?.data?.labels[index] as any,
            //   xLine + extraLine + plusFixPx,
            //   yLine
            // );
            ctx.fillText(
              chart?.data?.labels[index] as any,
              xLine + plusFixPx,
              yLine - 10
            );
          });
        });
        ctx.restore();
      },
      beforeDraw(chart) {
        //https://www.youtube.com/watch?v=c2mzQKpd_DI
        const { ctx, data }: any = chart;

        ctx.save();
        const xCoor = chart.getDatasetMeta(0).data[0].x;
        const yCoor = chart.getDatasetMeta(0).data[0].y;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${data?.labels[0]}`, xCoor, yCoor);
      },
    });
  }
}
