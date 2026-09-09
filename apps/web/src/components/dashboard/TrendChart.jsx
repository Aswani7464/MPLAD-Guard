function TrendChart({ title = 'Project Progress Trend', data = [] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 100)

  return (
    <div className="trend-chart">
      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          <p>Project performance over time</p>
        </div>
      </div>

      <div className="chart-area">
        {data.length === 0 ? (
          <p className="chart-empty">No trend data available.</p>
        ) : (
          data.map((item, index) => (
            <div className="chart-column" key={index}>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                  }}
                  title={`${item.value}%`}
                ></div>
              </div>

              <span className="chart-label">{item.label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TrendChart
