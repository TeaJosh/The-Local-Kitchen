import { useEffect, useRef, useState } from "react";
import * as nsfwjs from "nsfwjs";
import * as tf from "@tensorflow/tfjs";

export function useNsfwCheck() {
    const modelRef = useRef<nsfwjs.NSFWJS | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const loadModel = async () => {
            await tf.ready();
            modelRef.current = await nsfwjs.load();
            setReady(true);
    };
    loadModel();
}, []);

  const checkImage = async (imageElement: HTMLImageElement): Promise<boolean> => {
    if (!modelRef.current) throw new Error("NSFW model not loaded yet.");

    const predictions = await modelRef.current.classify(imageElement);

    const porn = predictions.find(p => p.className === "Porn")?.probability ?? 0;
    const hentai = predictions.find(p => p.className === "Hentai")?.probability ?? 0;
    const sexy = predictions.find(p => p.className === "Sexy")?.probability ?? 0;

    // Returns true if image is NSFW
    return porn > 0.7 || hentai > 0.7 || sexy > 0.85;
  };

  return { checkImage, ready };
}
