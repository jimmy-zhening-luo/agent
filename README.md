# [Xfinity AI support agent](https://github.com/jimmy-zhening-luo/agent)

[![Azure App Service Deploy](https://github.com/jimmy-zhening-luo/agent/actions/workflows/PROD.main.yml/badge.svg)](https://github.com/jimmy-zhening-luo/agent/actions/workflows/PROD.main.yml)

_Author: [Jimmy Luo](https://github.com/jimmy-zhening-luo)_

Chat agent that assists Xfinity Home Internet customers with their various support needs, automating as many support tasks as possible.

# Business Statement

## Goal

- __Lower Cost:__ Decrease customer service cost.
- __Higher Sat:__ Increase or maintain parity of customer satisfaction.

## Customer Needs

1. __Informational:__ Questions that need answers, with routing to the appropriate support agent as-needed.
1. __Troubleshoot:__ Technical troubleshooting that can be turn-based performed with the user.
1. __Account:__ Customer support needs that require account access, e.g., billing, new/modify service, cancel, move

## Milestones

|         | Effort  | Informational | Troubleshoot                 | Account                                                                                                 |
| :------ | :------ | :------------ | :--------------------------- | :------------------------------------------------------------------------------------------------------ |
| __MVP__ | 0.1 Eng | Full Support  |                              |                                                                                                         |
| __M2__  | 2 Eng   | \=            | Step-by-step troubleshooting |                                                                                                         |
| __M3__  | 6 Eng   | \=            | \=                           | Account access capability; initial limited support (e.g., first-line retention & sales) with long tail. |

Unsupported scenarios at any time are automatically routed to customer support to avoid drop-off and maintain parity.

# Design

## Infrastructure

1. __Chat UI client:__ developer-hosted frontend with embedded [ChatKit](https://developers.openai.com/api/docs/guides/chatkit) UI, can be embedded on any site
   1. Repository (this): [https://github.com/jimmy-zhening-luo/agent](https://github.com/jimmy-zhening-luo/agent)
1. __Session proxy server:__ developer-hosted server to negotiate session between client and agent host
   1. Endpoint: [https://chat-server.jim.so/health](https://chat-server.jim.so/health)
   1. Repository: [https://github.com/jimmy-zhening-luo/agent-server](https://github.com/jimmy-zhening-luo/agent-server)
1. __Agent host:__ [Agents SDK](https://developers.openai.com/api/docs/guides/agents) logic deployed to and hosted on OpenAI

## Agent Workflow

<img width="3320" height="874" alt="Agent Design" src="https://github.com/user-attachments/assets/85b10696-f7ba-44f7-9eb5-5c3092d03e87" />

1. __Ingress:__ User Prompt
   1. Site-embedded UI
   1. Input Guardrail: Jailbreak, Topicality
1. __Intent Classifier:__ route to correct agent to assist with customer support need
1. __Agents:__ task handlers for individual intent taxa
   1. Output Guardrail
1. __End:__ User Choice
   1. MVP: limited to “Done?” and “Connect to a live agent?”
   1. Future: next turn

### Ingress

#### Turns

- MVP: single-turn for informational question-answer
- M2+: multi-turn for multi-step tasks like troubleshooting and account assistance

#### Input Guardrail

OpenAI’s off-the-shelf guardrail (GPT-5.4-nano) terminates chat if jailbreak or off-topic.

### Intent Classifier

Intent top-level taxonomy is a 1:1 map to Customer Support Need:

1. Informational
1. Troubleshoot
1. Account

An agent (OpenAI’s GPT-5.5) classifies the support prompt into one of the three L1 intents.

Each intent has a specialized agent to handle it (1-to-1 mapping between L1 intent & agent).

Prompts that cannot be classified will fallback by offering to connect to a live agent.

Keeping intent classification at L1:

- Avoids over-structuring the intent taxonomy (allows agent to use built-in intelligence to solve a task, rather than forcibly constraining the task to some narrow intent)
- Enables hillclimbing L1 classification quality
- Enables hillclimbing support agent task fulfillment/coverage within each L1 intent taxa

### Agents

Intent-to-agent map is a 1:1 map of L1 intent to corresponding agent:

1. \[MVP\] Informational
1. \[M2\] Troubleshoot
1. \[M3\] Account
1. \-\> (Fallback/Escalation) Connect to agent

#### \[MVP\] Informational

This agent will answer an informational question, and then ask the user whether their need has been met:

- If needs met, end chat.
- Else, fallback to “connect to live agent?” prompt.

##### Information Retrieval

A dual-corpus search strategy is used:

###### _Primary Corpus: Online Web Search_

The __support agent__, OpenAI’s GPT-5.5, retrieves information using its built-in web search tool, with instructions to source its answers from the canonical Xfinity Home Internet support sitemap node: [https://www.xfinity.com/support/internet](https://www.xfinity.com/support/internet)

Xfinity Home Internet support documents are already pre-indexed with high query traffic on Google Search, thus the agent is expected to achieve high accuracy and precision by issuing a targeted search query and distilling the top results.

GPT’s web search tool also automatically grounds answers with the relevant support URL as citation; this structured grounding serves as a naive guardrail against hallucination.

###### _Secondary/Guard Corpus: Offline Semantic Search (Vector Store)_

The output of the agent is then filtered by an off-the-shelf hallucination __guard agent__ (GPT-5.5) to guard against hallucinated informational answers. The guard agent issues a semantic search on an offline vector store to corroborate the answer generated by the support agent, dropping conflicting answers. The vector store contains query-to-document embeddings:

1. Crawl the Xfinity support site documents.
1. Transform documents to Markdown.
1. Create a vector mapping between the question (possible prompts) and answer (site documents) spaces using OpenAI’s off-the-shelf\* semantic embedding generator.

\*Large language models have built-in semantic understanding, which would compensate for the lack of real-world prompts to use as a prior for embedding generation.

Despite being faster and possibly higher-accuracy, semantic search is only used as a guardrail:

- Online web-search corpus uses __search ranking__ for higher precision and recall.
- Web search citations give __structured grounding__ for free, which would increase accuracy and precision. Semantic search on embeddings is fully unstructured, meaning structured grounding would need to be done as a separate step.
- __Latency__ is not a critical factor here. Information lookup latency is relatively small compared to the existing informational customer support flow of finding and manually parsing information online.

#### \[Future \- M2+\] Troubleshoot & Account

In MVP, the Troubleshoot & Account agents will forward to the “connect to live agent” fallback.

# Release

## MVP Candidate Evaluation

Human raters will label golden eval sets for intent classifier and agents respectively. Release criteria will be gated on auto-evaluation results using GPT-5.5-Pro with extended thinking:

1. Auto-evaluations will be run on _m_ examples _n_ times
1. A random sample of disagreements between auto-evaluation runs, and a smaller random sample will be manually cross-checked and loss-bucketed by human raters for future hill-climbing of:
   1. Auto-evaluation prompt
   1. Objective criteria
   1. Golden set selection
   1. Golden set labeling

### Intent Classifier

A golden eval set of minimum 60 (n^3) prompts must be completely, correctly classified 10 times out of 10 to meet release criteria (600 out of 600 correct). For each L1 intent added, the golden eval set grows exponentially. (Four intents require 64 examples to be correctly classified 10 times out of 10.)

The golden eval set will include the eval examples from all agents, too to avoid duplication across agents.

__Eval set:__ [https://github.com/jimmy-zhening-luo/agent/blob/main/eval/intent.csv](https://github.com/jimmy-zhening-luo/agent/blob/main/eval/intent.csv)

### Each Agent

Each agent will also have a golden eval set of prompts that must meet user-needs-met release criteria. Each agent golden set is expected to grow over time (see Continuous Refinement below).

Each agent’s user-needs-met will be evaluated by a human rater using the objective criteria defined for that agent.

#### \[MVP\] Informational

10 canonical informational needs (pretend data that these are the top known info needs) are included in a golden eval with the following columns and to be evaluated as follows:

##### Objective Criteria

1. The critical required information is provided for the question. The evaluation output is rated from 0 (needs unmet) to 2 (needs fully met):

| Score | Meaning       | Criteria                                                                                                                                         |
| :---- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Unmet         | The critical information is not contained in the answer.                                                                                         |
| 1     | Partially Met | The critical information is partially contained in the answer, or fully contained in the answer but the answer contains conflicting information. |
| 2     | Fully Met     | The critical information is fully contained in the answer, with no conflicting additional information.                                           |

1. The canonical citation page is given. Check the box if the correct page is cited.

Scoring for each evaluation output will be Needs Met (0-2) \+1 if the citation page checkbox is checked.

##### Release Threshold

The golden eval set of 20 evals will be run 5 times. The total score must be over 200 (out of 300 possible) to meet release criteria.

__Eval set:__ [https://github.com/jimmy-zhening-luo/agent/blob/main/eval/agents/informational.csv](https://github.com/jimmy-zhening-luo/agent/blob/main/eval/agents/informational.csv)

## M1+ Continuous Refinement

### Loss Analysis

#### Input Guardrail / Intent Classifier

1. Mark for manual review a random sample of prompts that passed the input guardrail but failed to be classified & a smaller random sample of prompts that failed the input guardrail for false-positive abuse tuning.
1. Reviewers will bucket losses & add __intent-classifier__ eval-set cases for further hillclimbing. Further, input guardrail false positives will be noted but for now no hillclimbing, as we consider input guardrail false positives an upstream failure (i.e.., jailbreak identification is owned by the vendor, not by us).

#### Each Agent

1. After release, a random sample of the total querystream & a higher random sample of the NOT user-needs-met querystream will be marked for manual review.
1. Reviewers will bucket both losses & wins, and add __agent__ eval-set cases for further hillclimbing in a query-weighted fashion:
   1. Common wins not covered in golden set evals would earn a canonical eval set example to avoid future regression
   1. Most common losses will also earn an eval-set slot for hillclimbing for next release.
1. Some losses (but should be very few) may be a result of incorrect intent classification. These will be remitted back to intent classification for loss-bucketing and hillclimbing.

### Iteration Evaluation

#### Inner Loop Development

Inner loop development will use new and existing examples in single-sided evaluations with human graders to hillclimb toward a new launch candidate.

#### Outer Loop Release

Outer loop development will use either or both:

1. Single-sided evaluations to demonstrate full coverage of newly identified losses, using the same auto-evaluation described in the MVP evaluation plan.
1. Double-sided evaluations to demonstrate qualitative (rated) improvements since last iteration on wins, using _n_ runs of auto-evaluators rating the two sides respectively, with the same human cross-checking plan described in the MVP evaluation plan to hill-climb auto-evaluator quality.
