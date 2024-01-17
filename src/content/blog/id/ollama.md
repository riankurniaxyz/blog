---
author: Rian Kurnia
pubDatetime: 2024-01-17T15:30:00Z
title: Ollama
postSlug: ollama
featured: false
draft: false
tags:
    - ai
description:
  Menggunakan AI model secara offline
---

<div>
  <img src="/assets/post-3/llama.jpg" class="w-auto" alt="Llama">
</div>

Insomnia. Jam 11 malam belum bisa tidur dan masih melihat langit-langit rumah. Tiba-tiba terpikir, "apa mungkin ya menggunakan ChatGPT secara offline?". Bangun dari tempat tidur, cari informasi di internet. Jam 12 ketemulah [ollama](https://ollama.ai/) yang memungkinkan untuk menjalankan AI model secara lokal di komputer tanpa perlu internet dan juga [Minimalistic interface for LLM](https://github.com/richawo/minimal-llm-ui) untuk UI bagi ollama. Sayangnya ollama tidak dapat diinstall di Windows, dan beruntungnya komputer utama di rumah menggunakan Linux (Arch Linux).
```bash
curl https://ollama.ai/install.sh | sh
```

Model-model AI yang dapat digunakan untuk ollama adalah model-model AI yang opensource seperti [Llama](https://ai.meta.com/llama/) dari Meta, [Phi-2](https://huggingface.co/microsoft/phi-2) dari Microsoft Research, atau [Mistral](https://huggingface.co/mistralai/Mistral-7B-v0.1). Sayangnya ChatGPT tidak bisa digunakan secara offline karena bukan model AI yang opensource dan diinstall pada suatu komputer secara bebas. Jam 1 mulai menginstall model AI dari Mistral yang berukuran sekitar 4GB (terimakasih kepada paket unlimited malam Sm4rtfr3n jam 01-05).
```bash
ollama run mistral
```

Jam 3 proses penginstallan selesai. Untuk menggunakan model AI pada suatu komputer secara lokal, kita memerlukan komputer dengan spek yang cukup tinggi. Amannya kita memiliki RAM di atas 8GB dan akan lebih baik jika memiliki kartu grafik NVIDIA. Berikut ini adalah contoh dari penggunaan ollama di terminal (command prompt).

<video muted="muted" controls>
  <source src="/assets/post-3/ollama_terminal.webm" type="video/webm">
</video>

Untuk mendapatkan tampilan di web seperti ChatGPT kita akan menggunakan [Minimalistic interface for LLM](https://github.com/richawo/minimal-llm-ui). Penginstallan di linux dapat dilakukan sebagai berikut.
```bash
git clone https://github.com/richawo/minimal-llm-ui.git
cd minimal-llm-ui
npm install
npm run dev
```

Contoh penggunannya sebagai berikut.
<video muted="muted" plays-inline="true" controls>
  <source src="/assets/post-3/ollama_minimalui.webm" type="video/webm">
</video>

