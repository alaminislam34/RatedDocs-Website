import { create } from "zustand";
import { devtools } from "zustand/middleware"; // প্রোডাকশন ডিবাগিং সহজ করার জন্য
import { createVerificationSlice, VerificationSlice } from "./slices/verificationSlice";
import { createUISlice, UISlice } from "./slices/uiSlice";
import { createDataSlice, DataSlice } from "./slices/dataSlice";

// কম্বাইন্ড স্টোর ইন্টারফেস
type AppStoreState = VerificationSlice & UISlice & DataSlice;

export const useAppStore = create<AppStoreState>()(
    devtools((...a) => ({
        ...createVerificationSlice(...a),
        ...createUISlice(...a),
        ...createDataSlice(...a),
    }))
);