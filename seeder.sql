
-- MAKE SURE TO RUN schema.sql first

-- ============================================================
-- SEED DATA - Example Grammar (是…的)
-- ============================================================

insert into public.grammars (order_number, title, pinyin, hsk_level, category, short_description, explanation)
values (
  1,
  '是…的 (shì…de)',
  'shì…de',
  2,
  'Emphasis',
  'Emphasize details of a past event: when, where, how, or by whom.',
  '{
    "function": "Emphasize specific details of a past event (time, place, manner, or agent)",
    "structure": "S + 是 + Detail (Time/Place/Manner) + V + 的",
    "structure_notes": [
      "S = Subject",
      "V = Verb",
      "O = Object (optional)",
      "K = Adverbial detail"
    ],
    "examples": [
      {"chinese": "我是昨天来的", "pinyin": "Wǒ shì zuótiān lái de", "english": "I came yesterday.", "breakdown": "S 我 + K 昨天 + V 来"},
      {"chinese": "他是在北京学汉语的", "pinyin": "Tā shì zài Běijīng xué Hànyǔ de", "english": "He studied Chinese in Beijing.", "breakdown": "S 他 + K 在北京 + V 学汉语"},
      {"chinese": "我们是坐车去的", "pinyin": "Wǒmen shì zuò chē qù de", "english": "We went by car.", "breakdown": "S 我们 + K 坐车 + V 去"}
    ],
    "usage_tips": [
      "Use when answering detailed questions about past events",
      "The event must have already occurred",
      "是 can sometimes be omitted in spoken Chinese, but 的 must remain"
    ],
    "common_mistakes": [
      "Do not use 是…的 for future events",
      "的 must always come at the end of the sentence"
    ]
  }'
);

insert into public.quiz_questions (grammar_id, question_number, words, correct_answer, hint)
select
  id,
  1,
  array['我', '是', '昨天', '来', '的'],
  '我是昨天来的',
  'Think: Subject + 是 + Time + Verb + 的'
from public.grammars where order_number = 1;

insert into public.quiz_questions (grammar_id, question_number, words, correct_answer, hint)
select
  id,
  2,
  array['他', '是', '在北京', '学汉语', '的'],
  '他是在北京学汉语的',
  'Think: Subject + 是 + Place + Verb + 的'
from public.grammars where order_number = 1;

insert into public.quiz_questions (grammar_id, question_number, words, correct_answer, hint)
select
  id,
  3,
  array['我们', '是', '坐车', '去', '的'],
  '我们是坐车去的',
  'Think: Subject + 是 + Manner + Verb + 的'
from public.grammars where order_number = 1;

-- Add more grammars following the same pattern (order_number 2-30)
-- Example placeholder for grammar 2:
insert into public.grammars (order_number, title, pinyin, hsk_level, category, short_description, explanation)
values (
  2,
  '已经…了 (yǐjīng…le)',
  'yǐjīng…le',
  2,
  'Time',
  'Express that something has already happened or a state has been reached.',
  '{
    "function": "Indicate that an action is already completed or a state has already been reached",
    "structure": "S + 已经 + V/Adj + 了",
    "structure_notes": [
      "S = Subject",
      "已经 = already (adverb, placed before the verb)",
      "了 = change-of-state particle at end of sentence"
    ],
    "examples": [
      {"chinese": "我已经吃了", "pinyin": "Wǒ yǐjīng chī le", "english": "I have already eaten.", "breakdown": "S 我 + 已经 + V 吃 + 了"},
      {"chinese": "他已经回家了", "pinyin": "Tā yǐjīng huí jiā le", "english": "He has already gone home.", "breakdown": "S 他 + 已经 + V 回家 + 了"},
      {"chinese": "她已经是老师了", "pinyin": "Tā yǐjīng shì lǎoshī le", "english": "She is already a teacher.", "breakdown": "S 她 + 已经 + 是 + O 老师 + 了"}
    ],
    "usage_tips": [
      "已经 always comes directly before the verb or adjective",
      "了 comes at the end of the sentence to indicate a change of state",
      "Can be used for both completed actions and changed states"
    ],
    "common_mistakes": [
      "Do not separate 已经 from the verb",
      "Remember to include 了 at the end of the sentence"
    ]
  }'
);

insert into public.quiz_questions (grammar_id, question_number, words, correct_answer, hint)
select id, 1, array['我', '已经', '吃', '了'], '我已经吃了', 'Subject + 已经 + Verb + 了'
from public.grammars where order_number = 2;

insert into public.quiz_questions (grammar_id, question_number, words, correct_answer, hint)
select id, 2, array['他', '已经', '回家', '了'], '他已经回家了', 'Subject + 已经 + Verb + 了'
from public.grammars where order_number = 2;

insert into public.quiz_questions (grammar_id, question_number, words, correct_answer, hint)
select id, 3, array['她', '已经', '是', '老师', '了'], '她已经是老师了', 'Subject + 已经 + 是 + Object + 了'
from public.grammars where order_number = 2;