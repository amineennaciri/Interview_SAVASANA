import { useState, useEffect } from "react"

function IndexPopup(): Element {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  //const [data, setData] = useState<string>('');

  const getCurrentUrl: () => Promise<void> = async (): Promise<void> => {
    const [tab] = await chrome.tabs.query(queryInfo: {active: true, currentWindow: true});
    setCurrentUrl(value: tab.url);
  }

  useEffect(effect: (): void =>{
    getCurrentUrl()
  }, deps:[ currentUrl ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h1>
        You are currently at {currentUrl}
      </h1>
    </div>
  )
}

export default IndexPopup
