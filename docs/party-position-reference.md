# Party position reference

Purpose: explain the numeric scores in src/data/party_positions.json against the 10 axes in src/data/axes.json so each party's stance is easy to justify.

## How to read the scores

- Range: -1 (full tilt to negative pole) to 1 (full tilt to positive pole); 0 = neutral/centred.
- Interpretation wording below uses: |score| >= 0.6 "strongly leans", 0.2–0.59 "leans", < 0.2 "slightly leans/centred".
- Axes and poles are defined once in the legend; per-party tables list the raw score and a short interpretation toward the relevant pole.

## Axis legend

| Axis ID                  | Name                                                          | Positive pole ( +1 )                                                              | Negative pole ( -1 )                                                              |
| ------------------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| service_delivery         | State-run Service Delivery ↔ Outsourced & Private             | State employees run water, electricity, refuse, and road services directly        | Private contractors and concessions deliver services under performance contracts  |
| accountability           | Strict Financial Accountability ↔ Flexible Management         | Strict audit culture, personal criminal liability, independent oversight units    | Flexible management, political discretion over financial decisions                |
| settlement_housing       | Formalise In Situ / Community Housing ↔ Relocate & Market     | Formalise settlements in place, subsidised rental housing, oppose evictions       | Relocate to formal housing, market-led development, enforce land-use bylaws       |
| tariffs_affordability    | Subsidised / Capped Tariffs ↔ Cost-reflective Rates           | CPI-capped tariffs, subsidised connections, expanded indigent rebates             | Cost-reflective, market-rate tariffs and strict disconnection enforcement         |
| coalition_governance     | Transparent & Structured Coalitions ↔ Executive Flexibility   | Binding, public coalition agreements with accountability mechanisms               | Flexible, ad-hoc coalitions with executive discretion and informal deals          |
| public_transport         | Mass Transit Investment ↔ Private Transport / Taxis           | Investment in BRT, rail, cycling, and pedestrian infrastructure                   | Accommodation of private transport, minibus taxis, and car-oriented infrastructure |
| land_densification       | Densification & Transit-oriented ↔ Greenfield & Sprawl        | Densification near transit corridors, town centre regeneration, rezoning for density | Greenfield peripheral development, sprawl, heritage protection over density    |
| metro_safety             | Expanded Municipal Policing ↔ SAPS Reliance                   | Expanded municipal law enforcement, community policing forums with formal power   | Reliance on national SAPS, national policing primacy                              |
| community_participation  | Participatory Ward Democracy ↔ Representative Council         | Ward committees with budget power, councillor recall, community referendums       | Councillor discretion, representative democracy without direct participation      |
| local_economy            | Active Municipal LED ↔ Private Sector-led                     | Municipal job creation, business incubators, local procurement preference         | Private sector-led growth, enabling environment only, minimal council intervention |

## Party tables

### ActionSA

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | -0.4  | Leans negative toward private contractors and outsourcing        |
| accountability          | 0.85  | Strongly leans positive toward strict audits and anti-corruption |
| settlement_housing      | -0.2  | Slightly leans negative toward market-led / relocate approach    |
| tariffs_affordability   | 0.1   | Near-neutral                                                     |
| coalition_governance    | 0.6   | Strongly leans positive toward structured, transparent coalitions |
| public_transport        | 0.3   | Leans positive toward mass transit investment                    |
| land_densification      | 0.4   | Leans positive toward densification and transit-oriented dev     |
| metro_safety            | 0.7   | Strongly leans positive toward expanded municipal policing       |
| community_participation | 0.2   | Slightly leans positive toward ward participation                |
| local_economy           | -0.1  | Near-neutral, slight lean toward private sector-led growth       |

### ACDP

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | -0.1  | Near-neutral                                                     |
| accountability          | 0.7   | Strongly leans positive toward strict financial accountability   |
| settlement_housing      | 0.1   | Near-neutral                                                     |
| tariffs_affordability   | 0.2   | Slightly leans positive toward subsidised/capped tariffs         |
| coalition_governance    | 0.4   | Leans positive toward structured coalitions                      |
| public_transport        | 0.1   | Near-neutral                                                     |
| land_densification      | -0.2  | Slightly leans negative toward greenfield/sprawl                 |
| metro_safety            | 0.3   | Leans positive toward expanded municipal policing                |
| community_participation | 0.4   | Leans positive toward ward participation                         |
| local_economy           | -0.2  | Slightly leans negative toward private sector-led growth         |

### ANC

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.4   | Leans positive toward state-run services                         |
| accountability          | 0.2   | Slightly leans positive toward accountability                    |
| settlement_housing      | 0.5   | Leans positive toward formalise-in-situ / community housing      |
| tariffs_affordability   | 0.4   | Leans positive toward subsidised/capped tariffs                  |
| coalition_governance    | 0.3   | Leans positive toward structured coalitions                      |
| public_transport        | 0.3   | Leans positive toward mass transit investment                    |
| land_densification      | 0.2   | Slightly leans positive toward densification                     |
| metro_safety            | 0.2   | Slightly leans positive toward municipal policing                |
| community_participation | 0.3   | Leans positive toward ward participation                         |
| local_economy           | 0.4   | Leans positive toward active municipal LED                       |

### COPE

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.1   | Near-neutral                                                     |
| accountability          | 0.8   | Strongly leans positive toward strict financial accountability   |
| settlement_housing      | 0.2   | Slightly leans positive toward formalise-in-situ housing         |
| tariffs_affordability   | 0.2   | Slightly leans positive toward subsidised/capped tariffs         |
| coalition_governance    | 0.6   | Strongly leans positive toward structured, transparent coalitions |
| public_transport        | 0.2   | Slightly leans positive toward mass transit                      |
| land_densification      | 0.2   | Slightly leans positive toward densification                     |
| metro_safety            | 0.3   | Leans positive toward expanded municipal policing                |
| community_participation | 0.6   | Strongly leans positive toward participatory ward democracy      |
| local_economy           | 0.2   | Slightly leans positive toward active municipal LED              |

### ATM

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.2   | Slightly leans positive toward state-run services                |
| accountability          | 0.5   | Leans positive toward strict accountability                      |
| settlement_housing      | 0.3   | Leans positive toward formalise-in-situ housing                  |
| tariffs_affordability   | 0.3   | Leans positive toward subsidised tariffs                         |
| coalition_governance    | 0.2   | Slightly leans positive toward structured coalitions             |
| public_transport        | 0.1   | Near-neutral                                                     |
| land_densification      | 0.0   | Neutral                                                          |
| metro_safety            | 0.2   | Slightly leans positive toward municipal policing                |
| community_participation | 0.3   | Leans positive toward ward participation                         |
| local_economy           | 0.2   | Slightly leans positive toward active LED                        |

### Al Jama-ah

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.3   | Leans positive toward state-run services                         |
| accountability          | 0.6   | Strongly leans positive toward strict accountability             |
| settlement_housing      | 0.4   | Leans positive toward formalise-in-situ / community housing      |
| tariffs_affordability   | 0.5   | Leans positive toward subsidised/capped tariffs                  |
| coalition_governance    | 0.3   | Leans positive toward structured coalitions                      |
| public_transport        | 0.3   | Leans positive toward mass transit investment                    |
| land_densification      | 0.1   | Near-neutral                                                     |
| metro_safety            | 0.3   | Leans positive toward expanded municipal policing                |
| community_participation | 0.5   | Leans positive toward participatory ward democracy               |
| local_economy           | 0.3   | Leans positive toward active municipal LED                       |

### DA

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | -0.7  | Strongly leans negative toward private contractors/outsourcing   |
| accountability          | 0.8   | Strongly leans positive toward strict accountability             |
| settlement_housing      | 0.0   | Neutral                                                          |
| tariffs_affordability   | -0.4  | Leans negative toward cost-reflective rates                      |
| coalition_governance    | 0.7   | Strongly leans positive toward structured, transparent coalitions |
| public_transport        | 0.5   | Leans positive toward mass transit investment                    |
| land_densification      | 0.6   | Strongly leans positive toward densification                     |
| metro_safety            | 0.6   | Strongly leans positive toward expanded municipal policing       |
| community_participation | 0.2   | Slightly leans positive toward ward participation                |
| local_economy           | -0.5  | Leans negative toward private sector-led growth                  |

### EFF

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.9   | Strongly leans positive toward state-run services                |
| accountability          | 0.3   | Leans positive toward accountability                             |
| settlement_housing      | 0.9   | Strongly leans positive toward formalise-in-situ / community housing |
| tariffs_affordability   | 0.9   | Strongly leans positive toward heavily subsidised tariffs        |
| coalition_governance    | -0.3  | Leans negative toward executive flexibility / ad-hoc coalitions  |
| public_transport        | 0.6   | Strongly leans positive toward mass transit investment           |
| land_densification      | 0.4   | Leans positive toward densification                              |
| metro_safety            | 0.3   | Leans positive toward municipal policing                         |
| community_participation | 0.6   | Strongly leans positive toward participatory ward democracy      |
| local_economy           | 0.7   | Strongly leans positive toward active municipal LED              |

### VF+

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | -0.6  | Strongly leans negative toward private contractors/outsourcing   |
| accountability          | 0.7   | Strongly leans positive toward strict accountability             |
| settlement_housing      | -0.2  | Slightly leans negative toward market-led / relocate approach    |
| tariffs_affordability   | -0.3  | Leans negative toward cost-reflective rates                      |
| coalition_governance    | 0.6   | Strongly leans positive toward structured coalitions             |
| public_transport        | -0.2  | Slightly leans negative toward private transport / taxis         |
| land_densification      | -0.1  | Near-neutral, slight lean toward sprawl/greenfield               |
| metro_safety            | 0.4   | Leans positive toward expanded municipal policing                |
| community_participation | 0.3   | Leans positive toward ward participation                         |
| local_economy           | -0.5  | Leans negative toward private sector-led growth                  |

### IFP

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.0   | Neutral                                                          |
| accountability          | 0.5   | Leans positive toward strict accountability                      |
| settlement_housing      | 0.2   | Slightly leans positive toward formalise-in-situ housing         |
| tariffs_affordability   | 0.2   | Slightly leans positive toward subsidised tariffs                |
| coalition_governance    | 0.5   | Leans positive toward structured coalitions                      |
| public_transport        | 0.1   | Near-neutral                                                     |
| land_densification      | -0.1  | Near-neutral                                                     |
| metro_safety            | 0.2   | Slightly leans positive toward municipal policing                |
| community_participation | 0.4   | Leans positive toward ward participation                         |
| local_economy           | 0.2   | Slightly leans positive toward active LED                        |

### NCC

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.1   | Near-neutral                                                     |
| accountability          | 0.4   | Leans positive toward accountability                             |
| settlement_housing      | 0.1   | Near-neutral                                                     |
| tariffs_affordability   | 0.2   | Slightly leans positive toward subsidised tariffs                |
| coalition_governance    | 0.2   | Slightly leans positive toward structured coalitions             |
| public_transport        | 0.1   | Near-neutral                                                     |
| land_densification      | 0.0   | Neutral                                                          |
| metro_safety            | 0.1   | Near-neutral                                                     |
| community_participation | 0.3   | Leans positive toward ward participation                         |
| local_economy           | 0.1   | Near-neutral                                                     |

### PAC

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.7   | Strongly leans positive toward state-run services                |
| accountability          | 0.4   | Leans positive toward accountability                             |
| settlement_housing      | 0.7   | Strongly leans positive toward formalise-in-situ / community housing |
| tariffs_affordability   | 0.7   | Strongly leans positive toward subsidised tariffs                |
| coalition_governance    | 0.2   | Slightly leans positive toward structured coalitions             |
| public_transport        | 0.4   | Leans positive toward mass transit investment                    |
| land_densification      | 0.1   | Near-neutral                                                     |
| metro_safety            | 0.3   | Leans positive toward municipal policing                         |
| community_participation | 0.5   | Leans positive toward participatory ward democracy               |
| local_economy           | 0.6   | Strongly leans positive toward active municipal LED              |

### PA

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.0   | Neutral                                                          |
| accountability          | 0.4   | Leans positive toward accountability                             |
| settlement_housing      | 0.1   | Near-neutral                                                     |
| tariffs_affordability   | 0.3   | Leans positive toward subsidised tariffs                         |
| coalition_governance    | -0.3  | Leans negative toward executive flexibility / ad-hoc coalitions  |
| public_transport        | 0.1   | Near-neutral                                                     |
| land_densification      | -0.2  | Slightly leans negative toward sprawl/greenfield                 |
| metro_safety            | 0.6   | Strongly leans positive toward expanded municipal policing       |
| community_participation | 0.2   | Slightly leans positive toward ward participation                |
| local_economy           | 0.2   | Slightly leans positive toward active LED                        |

### SACP

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.95  | Strongly leans positive toward state-run services                |
| accountability          | 0.4   | Leans positive toward accountability                             |
| settlement_housing      | 0.8   | Strongly leans positive toward formalise-in-situ / community housing |
| tariffs_affordability   | 0.9   | Strongly leans positive toward heavily subsidised tariffs        |
| coalition_governance    | 0.3   | Leans positive toward structured coalitions                      |
| public_transport        | 0.7   | Strongly leans positive toward mass transit investment           |
| land_densification      | 0.3   | Leans positive toward densification                              |
| metro_safety            | 0.4   | Leans positive toward expanded municipal policing                |
| community_participation | 0.8   | Strongly leans positive toward participatory ward democracy      |
| local_economy           | 0.9   | Strongly leans positive toward active municipal LED              |

### MK

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.8   | Strongly leans positive toward state-run services                |
| accountability          | -0.2  | Slightly leans negative toward flexible management               |
| settlement_housing      | 0.7   | Strongly leans positive toward formalise-in-situ / community housing |
| tariffs_affordability   | 0.8   | Strongly leans positive toward subsidised tariffs                |
| coalition_governance    | -0.4  | Leans negative toward executive flexibility / ad-hoc coalitions  |
| public_transport        | 0.3   | Leans positive toward mass transit investment                    |
| land_densification      | 0.0   | Neutral                                                          |
| metro_safety            | 0.1   | Near-neutral                                                     |
| community_participation | 0.3   | Leans positive toward ward participation                         |
| local_economy           | 0.6   | Strongly leans positive toward active municipal LED              |

### UDM

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.2   | Slightly leans positive toward state-run services                |
| accountability          | 0.5   | Leans positive toward strict accountability                      |
| settlement_housing      | 0.3   | Leans positive toward formalise-in-situ housing                  |
| tariffs_affordability   | 0.3   | Leans positive toward subsidised tariffs                         |
| coalition_governance    | 0.3   | Leans positive toward structured coalitions                      |
| public_transport        | 0.1   | Near-neutral                                                     |
| land_densification      | 0.1   | Near-neutral                                                     |
| metro_safety            | 0.2   | Slightly leans positive toward municipal policing                |
| community_participation | 0.4   | Leans positive toward ward participation                         |
| local_economy           | 0.2   | Slightly leans positive toward active LED                        |

### UFC

| Axis                    | Score | Interpretation                                                   |
| ----------------------- | ----- | ---------------------------------------------------------------- |
| service_delivery        | 0.0   | Neutral                                                          |
| accountability          | 0.7   | Strongly leans positive toward strict accountability             |
| settlement_housing      | 0.2   | Slightly leans positive toward formalise-in-situ housing         |
| tariffs_affordability   | 0.2   | Slightly leans positive toward subsidised tariffs                |
| coalition_governance    | 0.6   | Strongly leans positive toward structured, transparent coalitions |
| public_transport        | 0.3   | Leans positive toward mass transit investment                    |
| land_densification      | 0.2   | Slightly leans positive toward densification                     |
| metro_safety            | 0.3   | Leans positive toward expanded municipal policing                |
| community_participation | 0.4   | Leans positive toward ward participation                         |
| local_economy           | 0.2   | Slightly leans positive toward active LED                        |
