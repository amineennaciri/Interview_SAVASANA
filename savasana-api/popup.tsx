import React, { useState, useEffect } from "react"
import type { ChangeEvent } from "react";

function IndexPopup(): JSX.Element {
  const [wordToTranslate, setWordToTranslate] = React.useState<string>('');
  const [sourceLanguage, setSourceLanguage] = React.useState<string>('');
  const [targetLanguage, setTargetLanguage] = React.useState<string>('');
  const [wordTranslated, setWordTranslated] = React.useState<string>('');
  console.log(wordToTranslate);
  console.log(sourceLanguage);
  console.log(targetLanguage);
  console.log(wordTranslated);

  let handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("translations", {
        method: "post",
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          wordToTranslate: wordToTranslate,
          sourceLanguage: sourceLanguage,
          targetLanguage: targetLanguage,
        }),
      });
      const data = await response.json();
      //let resJson = await res.json();
      console.log(data);
      if (response.status === 200) {
        setWordToTranslate("");
        setSourceLanguage("");
        setTargetLanguage("");
        setWordTranslated("User created successfully");
      } else {
        setWordTranslated("Some error occurred");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        /* display: "flex",
        flexDirection: "column",
        padding: 16 */
      }}>
      <h1>
        Welcome to SAVASANA Translation API.
      </h1>
      <form className="input-wrapper" onSubmit={handleSubmit}>
      <label htmlFor="translateWord">Enter Word:{' (ex: hello)'}</label>
      <input id="translateWord" type="text"
      title="letter word"
      value={wordToTranslate}
      onChange={(event: ChangeEvent<HTMLInputElement>)=>{
        const nextWord = event.target.value;
        setWordToTranslate(nextWord)}}/>
      <label htmlFor="translateSource">Enter Source Language:{' (ex: en)'}</label>
      <input id="translateSource" type="text" minLength={2} maxLength={2}
      pattern="[a-z]{2}"
      title="2 letter word"
      disabled={sourceLanguage.length>2}
      value={sourceLanguage}
      onChange={(event: ChangeEvent<HTMLInputElement>)=>{
        const nextSourceLanguage = event.target.value;
        setSourceLanguage(nextSourceLanguage)}}/>
      <label htmlFor="translateTarget">Enter Target Language:{' (ex: fr)'}</label>
      <input id="translateTarget" type="text" minLength={2} maxLength={2}
      pattern="[a-z]{2}"
      title="2 letter word"
      disabled={targetLanguage.length>2}
      value={targetLanguage}
      onChange={(event: ChangeEvent<HTMLInputElement>)=>{
        const nextTargetLanguage = event.target.value;
        setTargetLanguage(nextTargetLanguage)}}/>
      <button type="submit">Submit</button>
    </form>
    <h2>Translation Result:{' '}{wordTranslated}</h2>
    </div>
  )
}

export default IndexPopup


  /*
  const getCurrentUrl: () => Promise<void> = async (): Promise<void> => {
    const [tab] = await chrome.tabs.query(queryInfo: {active: true, currentWindow: true})
    setCurrentUrl(value: tab.url)
  }

  useEffect(effect: (): void =>{
    getCurrentUrl()
  }, deps:[ currentUrl ]) */