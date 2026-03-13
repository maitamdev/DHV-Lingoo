// Web Vitals reporting
export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(metric.name, metric.value);
  }
}
// LCP FID CLS metrics
