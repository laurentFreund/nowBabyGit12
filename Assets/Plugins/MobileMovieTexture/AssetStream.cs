using UnityEngine;
using System.Collections;
using System;

public class AssetStream : MonoBehaviour
{
    public static void GetFileOffsetLength(string fileName, out long offset, out long length)
    {
#if UNITY_ANDROID && !UNITY_EDITOR

        using (AndroidJavaClass cls_UnityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
        {
            using (AndroidJavaObject obj_Activity = cls_UnityPlayer.GetStatic<AndroidJavaObject>("currentActivity"))
            {
                using (AndroidJavaObject assetManager = obj_Activity.Call<AndroidJavaObject>("getAssets")) //android.content.res.AssetManager
                {
                    using (AndroidJavaObject assetFileDescriptor = assetManager.Call<AndroidJavaObject>("openFd", fileName)) //assets/ //android.content.res.AssetFileDescriptor
                    {
                        if (AndroidJNI.ExceptionOccurred() != IntPtr.Zero)
                        {
                            AndroidJNI.ExceptionDescribe();
                            AndroidJNI.ExceptionClear();

                            throw new System.IO.IOException(fileName + " not found");

                        }
                        else
                        {
                            offset = assetFileDescriptor.Call<long>("getStartOffset");
                            length = assetFileDescriptor.Call<long>("getLength");
                        }
                    }

                }
            }
        }
      
#else //UNITY_ANDROID && !UNITY_EDITOR
        length = 0;
        offset = 0;
#endif //UNITY_ANDROID && !UNITY_EDITOR
    }

    public static string GetApkPath()
    {
#if UNITY_ANDROID && !UNITY_EDITOR
        using (AndroidJavaClass cls_UnityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
        {
            using (AndroidJavaObject obj_Activity = cls_UnityPlayer.GetStatic<AndroidJavaObject>("currentActivity"))
            {
                return obj_Activity.Call<string>("getPackageCodePath");
            }
        }
#else //UNITY_ANDROID && !UNITY_EDITOR
        return "";
#endif //UNITY_ANDROID && !UNITY_EDITOR

    }
}
