# MPLAD-Guard Risk Methodology

The MPLAD-Guard risk analysis system evaluates project information to identify potential project risks.

## Risk Factors

The current risk scoring model considers:

* Budget risk
* Progress risk
* Delay risk
* Verification risk

## Risk Score

The overall risk score is calculated using weighted risk factors:

```text
Overall Risk Score =
    Budget Risk × 0.25
    + Progress Risk × 0.30
    + Delay Risk × 0.25
    + Verification Risk × 0.20
```

Each factor is normally represented on a scale from 0 to 100.

## Risk Levels

The resulting score is classified as:

|    Score | Risk Level |
| -------: | ---------- |
|  0–39.99 | Low        |
| 40–69.99 | Medium     |
|   70–100 | High       |

## Machine Learning

The machine learning module can additionally be used to:

* Predict project risk scores
* Detect unusual project patterns
* Support future project predictions

The ML implementation is located in:

```text
ml/
```

## AI Assistance

The AI module can provide explanations of identified risks and generate project monitoring reports using available project information.

The AI implementation is located in:

```text
ai/
```

## Risk Management

Risk results should be used to identify projects that may require additional monitoring, verification, or corrective action.

