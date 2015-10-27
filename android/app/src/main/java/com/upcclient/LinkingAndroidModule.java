package com.upcclient;

import android.view.ViewManager;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.shell.MainReactPackage;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by bogdantirca on 10/27/15.
 */

public class LinkingAndroidModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    public LinkingAndroidModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LinkingAndroidModule";
    }

    public static class AnExampleReactPackage extends MainReactPackage {
        @Override
        public List<NativeModule> createNativeModules(
                ReactApplicationContext reactContext) {
            List<NativeModule> modules = super.createNativeModules(reactContext);

            modules.add(new LinkingAndroidModule(reactContext));
            return modules;
        }
    }
}
