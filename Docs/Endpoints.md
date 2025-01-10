## save composition

```http
POST /api/compositions
Content-Type: application/json
{
  "name": string,
  "mood": string,
  "tempo": number,
  "instrument": string,
  "melody": string
}

GET /api/compositions
Response: Composition[]

GET /api/compositions/:id
Response: Composition

DELETE /api/compositions/:id
```

## effects presets

```http
POST /api/effect-presets
Content-Type: application/json
{
"name": string,
"effects": EffectSettings[]
}

GET /api/effect-presets
Response: EffectPreset[]

DELETE /api/effect-presets/:id
```
