const bbOnLogout = function() {
    BreadButter.api.resetDeviceVerification(function () {});
    let url = decodeHtmlEntities(decodeURIComponent(BB_LOGOUT_URL));
    window.location.assign(url.replaceAll('&amp;', '&'));
}
const decodeHtmlEntities = (encodedString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(encodedString, "text/html");
    return doc.documentElement.textContent;
}
const loadBreadButterConfiguration = function () {
    let has_continue_with = bb_config_params.has_continue_with && bb_config_params.has_continue_with != '0' ? true : false;
    let is_home_url = bb_config_params.is_home_url;
    let continue_with_home = bb_config_params.continue_with_home_page;

    let continue_with_success_seconds = bb_config_params.continue_with_success_seconds;
    let continue_with_success_header = bb_config_params.continue_with_success_header;
    let continue_with_success_text = bb_config_params.continue_with_success_text;
    let disable_continue_with_mobile = bb_config_params.disable_continue_with_mobile;

    let continue_with_config = {
        continue_with_success_seconds,
        continue_with_success_header,
        continue_with_success_text,
        disable_continue_with_mobile
    };

    let data = {
        app_id: bb_config_params.app_id,
        api_path: bb_config_params.api_path,
        page_view_tracking: bb_config_params.page_view_tracking ? true : false,
        continue_with_position: bb_config_params.continue_with_position,
        show_login_focus: bb_config_params.show_login_focus,
        allow_sub_domain: bb_config_params.allow_sub_domain,
        remember_close: bb_config_params.remember_close,
        remember_close_duration_hour: bb_config_params.remember_close_duration_hour,
        // expand_email_address: bb_config_params.expand_email_address,
        ga_measurement_id: bb_config_params.ga_measurement_id,
        wordpress_admin_ajax: bb_config_params.wordpress_admin_ajax,
        stack_order: bb_config_params.stack_order
    };

    let continue_with_email_option_overwrite = bb_config_params.email_option_overwrite;
    let continue_with_allowed_sso_providers = bb_config_params.allowed_sso_providers;
    let continue_with_require_names = bb_config_params.include_require_name;

    let user_profile_tool_position = bb_config_params.user_profile_tools.position;
    let user_profile_tool_enabled = bb_config_params.user_profile_tools.enabled && bb_config_params.user_profile_tools.enabled == 'on' ? true : false;
    if (bb_config_params["app_name"]) {
        data["app_name"] = bb_config_params["app_name"];
    }
    if (bb_config_params["destination_url"]) {
        data["destination_url"] = bb_config_params["destination_url"];
    }
    if (bb_config_params["callback_url"]) {
        data["callback_url"] = bb_config_params["callback_url"];
    }
    if (bb_config_params["button_theme"]) {
        data["button_theme"] = bb_config_params["button_theme"];
    }
    if (bb_config_params["locale"]) {
        data["locale"] = bb_config_params["locale"];
    }
    if (typeof BB_POST_NEWSLETTER !== "undefined" && typeof BB_POST_NEWSLETTER_DATA !== "undefined") {
        data["newsletter"] = BB_POST_NEWSLETTER_DATA;
    }
    if (typeof BB_OVERRIDE_REG_DESTINATION_URL !== "undefined" && BB_OVERRIDE_REG_DESTINATION_URL) {
        data["registration_destination_url"] = document.location.href;
    }
    if (typeof BB_PREVIEW_OVERRIDE_REG_DESTINATION_URL != 'undefined' && BB_PREVIEW_OVERRIDE_REG_DESTINATION_URL) {
        data["registration_destination_url"] = document.location.href;
    }
    if (typeof BB_CONTACTUS_OVERRIDE_REG_DESTINATION_URL != 'undefined' && BB_CONTACTUS_OVERRIDE_REG_DESTINATION_URL) {
        data["registration_destination_url"] = document.location.href;
    }
    if (typeof BB_CONTENT_GATING_ENABLE_SUCCESS_MESSAGE !== "undefined") {
        data['disable_content_gating_success_message'] = !BB_CONTENT_GATING_ENABLE_SUCCESS_MESSAGE;
    }
    if (typeof BB_CONTENT_PREVIEW_ENABLE_SUCCESS_MESSAGE !== "undefined") {
        data['disable_content_preview_success_message'] = !BB_CONTENT_PREVIEW_ENABLE_SUCCESS_MESSAGE;
    }

    if (bb_config_params["custom_data"]) {
        try {
            data["custom_data"] = JSON.parse(bb_config_params["custom_data"]);
        } catch(e) {
            console.warn('CUSTOM_DATA format issue.')
        }
    }
    let has_content_gating = false;
    let content_gating_config = {};


    if (typeof BB_POST_HAS_CONTENT_GATED !== "undefined" && BB_POST_HAS_CONTENT_GATED) {
        if (typeof BB_CONTENT_GATING_POST_LOCALE !== "undefined") {
            content_gating_config.locale = BB_CONTENT_GATING_POST_LOCALE;
        }
        if (typeof BB_GATING_OVERRIDE_REG_DESTINATION_URL !== "undefined" &&
            BB_GATING_OVERRIDE_REG_DESTINATION_URL
        ) {
            content_gating_config.registration_destination_url = document.location.href;
        }

        if (typeof BB_GATING_IMAGE_TYPE !== "undefined" &&
            BB_GATING_IMAGE_TYPE
        ) {
            content_gating_config.image_type = BB_GATING_IMAGE_TYPE;
        }

        if (typeof BB_GATING_IMAGE_URL !== "undefined" &&
            BB_GATING_IMAGE_URL
        ) {
            content_gating_config.image_source = BB_GATING_IMAGE_URL;
        }

        content_gating_config.scroll_limit = BB_CONTENT_GATING_SCROLL_LIMIT;
        content_gating_config.time_limit = BB_CONTENT_GATING_TIME_LIMIT;

        content_gating_config.background_color = BB_CONTENT_GATING_BACKGROUND_COLOR;
        content_gating_config.font_color = BB_CONTENT_GATING_FONT_COLOR;
        content_gating_config.button_color = BB_CONTENT_GATING_BUTTON_COLOR;
        content_gating_config.button_font_color = BB_CONTENT_GATING_BUTTON_FONT_COLOR;

        content_gating_config.image_default = BB_CONTENT_GATING_IMAGE_DEFAULT;

        if (typeof BB_CONTENT_GATING_SUCCESS_MESSAGE_HEADER !== "undefined" && BB_CONTENT_GATING_SUCCESS_MESSAGE_HEADER) {
            content_gating_config.success_header = BB_CONTENT_GATING_SUCCESS_MESSAGE_HEADER;
        }
        if (typeof BB_CONTENT_GATING_SUCCESS_MESSAGE_SUB_HEADER !== "undefined" && BB_CONTENT_GATING_SUCCESS_MESSAGE_SUB_HEADER) {
            content_gating_config.success_text = BB_CONTENT_GATING_SUCCESS_MESSAGE_SUB_HEADER;
        }


        if (typeof BB_IS_ADMIN_USER !== "undefined" && BB_IS_ADMIN_USER) {
            content_gating_config.success_header = "Content Gate Enabled";
            content_gating_config.success_text = "Because you are currently logged in as an Administrator in WordPress, you automatically have access to the content gate area. To test this function, please launch the same page in an incognito browser."
            content_gating_config.success_seconds = 0;
        }
        has_content_gating = true;
    }



    if (typeof BB_POST_HAS_CONTENT_PREVIEW !== "undefined" && BB_POST_HAS_CONTENT_PREVIEW && typeof BB_CONTENT_PREVIEW_POST_LOCALE !== "undefined") {
        data['content_preview'] = {
            restricted_links: null,
            scroll_limit: BB_CONTENT_PREVIEW_SCROLL_LIMIT,
            time_limit: BB_CONTENT_PREVIEW_TIME_LIMIT,
            locale: BB_CONTENT_PREVIEW_POST_LOCALE
        };
        if (typeof BB_CONTENT_PREVIEW_CLICLKABLE_CONTENT !== 'undefined') {
            data['content_preview']['clickable_content'] = BB_CONTENT_PREVIEW_CLICLKABLE_CONTENT;
        }
        if (typeof BB_CONTENT_PREVIEW_FIXED_HEIGHT !== 'undefined') {
            data['content_preview']['fixed_height'] = BB_CONTENT_PREVIEW_FIXED_HEIGHT;
        }


        if (typeof BB_GATING_EMAIL_OPTION_OVERWRITE !== "undefined" && BB_GATING_EMAIL_OPTION_OVERWRITE != 'inherit') {
            data['content_preview']['email_option_overwrite'] = BB_GATING_EMAIL_OPTION_OVERWRITE;
        }
        if (typeof BB_GATING_ALLOWED_SSO_PROVIDERS !== "undefined" && BB_GATING_ALLOWED_SSO_PROVIDERS != 'inherit') {
            data['content_preview']['allowed_sso_providers'] = BB_GATING_ALLOWED_SSO_PROVIDERS.split(',');
        }
        if (typeof BB_GATING_REQUIRE_NAMES !== "undefined" && BB_GATING_REQUIRE_NAMES) {
            data['content_preview']['include_name'] = true;
            data['content_preview']['require_name'] = true;
        }
        if (typeof BB_CONTENT_PREVIEW_SUCCESS_MESSAGE_HEADER !== "undefined" && BB_CONTENT_PREVIEW_SUCCESS_MESSAGE_HEADER) {
            data['content_preview']['success_header'] = BB_CONTENT_PREVIEW_SUCCESS_MESSAGE_HEADER;
        }
        if (typeof BB_CONTENT_PREVIEW_SUCCESS_MESSAGE_SUB_HEADER !== "undefined" && BB_CONTENT_PREVIEW_SUCCESS_MESSAGE_SUB_HEADER) {
            data['content_preview']['success_text'] = BB_CONTENT_PREVIEW_SUCCESS_MESSAGE_SUB_HEADER;
        }

        if (typeof BB_IS_ADMIN_USER !== "undefined" && BB_IS_ADMIN_USER) {
            data['content_preview']['success_header'] = "Content Gate Enabled";
            data['content_preview']['success_text'] = "Because you are currently logged in as an Administrator in WordPress, you automatically have access to the content gate area. To test this function, please launch the same page in an incognito browser."
            data['content_preview']['success_seconds'] = 0;
        }
    }
    if (bb_config_params["continue_with_all_pages"]) {
        has_continue_with = true;
    }

    let continue_with_delay_seconds = bb_config_params['continue_with_delay_seconds'];

    let enable_page_settings = false;
    let page_has_continue_with = false;
    let page_settings = bb_config_params.page_settings || {};
    const BB_KEY = "breadbutter_post_";
    let page_config = {};
    const post_locale = {};
    let page_user_profile_tool_enabled = false;
    for (let key in page_settings) {
        if (key.indexOf(BB_KEY) == 0) {
            let value = page_settings[key][0];
            let bb_key = key.replace(BB_KEY, "");
            switch (bb_key) {
                case "continue_with":
                    page_has_continue_with = value ? true : false;
                    break;
                case "enabled":
                    enable_page_settings = value ? true : false;
                    break;
                case "app_name":
                case "callback_url":
                case "destination_url":
                case "client_data":
                case "button_theme":
                    if (value) {
                        page_config[bb_key] = value;
                    }
                    break;
                // case "expand_email_address":
                case "show_login_focus":
                case "force_reauthentication":
                    page_config[bb_key] = value ? true : false;
                    break;
                case "user_profile_tool":
                    page_user_profile_tool_enabled = value ? true : false;
                    break;
                case "as_destination_url":
                case "is_restricred":
                case "is_gated":
                    if (value) {
                        page_config["destination_url"] = document.location.href;
                    }
                    break;
                case "blur_text_1":
                    if (value) {
                        post_locale.TEXT_1 = value;
                    }
                    break;
                case "blur_text_2":
                    if (value) {
                        post_locale.TEXT_2 = value;
                    }
                    break;
                case "blur_text_3":
                    if (value) {
                        post_locale.TEXT_3 = value;
                    }
                    break;
                case "blur_text_3_2":
                    if (value) {
                        post_locale.TEXT_3_2 = value;
                    }
                    break;
                case "blur_more_text":
                    if (value) {
                        post_locale.MORE = ' ' + value;
                    }
                    break;
                case "header_1":
                    if (value) {
                        post_locale.HEADER_1 = value;
                    }
                    break;
                case "header_2":
                    if (value) {
                        post_locale.HEADER_2 = value;
                    }
                    break;
                case "header_back_1":
                    if (value) {
                        post_locale.HEADER_BACK_1 = value;
                    }
                    break;
                case "header_back_2":
                    if (value) {
                        post_locale.HEADER_BACK_2 = value;
                    }
                    break;
                case 'continue_with_popup_delay_seconds':
                    if (value) {
                        continue_with_delay_seconds = value;
                    }
                    break;
                case 'continue_with_success_seconds':
                    if (value) {
                        continue_with_config.continue_with_success_seconds = value;
                    }
                    break;
                case 'continue_with_success_header':
                    if (value) {
                        continue_with_config.continue_with_success_header = value;
                    }
                    break;
                case 'continue_with_success_text':
                    if (value) {
                        continue_with_config.continue_with_success_text = value;
                    }
                    break;
            }
        }
    }
    if (
        page_settings["breadbutter_post_subscriber_profile_position_vertical"] && (
            page_settings["breadbutter_post_subscriber_profile_position_vertical"][0] == "top" ||
            page_settings["breadbutter_post_subscriber_profile_position_vertical"][0] == "bottom"
        )
    ) {
        if (!user_profile_tool_position) {
            user_profile_tool_position = {};
        }
        let pos = page_settings["breadbutter_post_subscriber_profile_position_vertical"][0];
        let pixel =
            page_settings["breadbutter_post_subscriber_profile_position_vertical_px"]?.[0];
        user_profile_tool_position[pos] = pixel;

        let oppositeVertical = pos === "top" ? "bottom" : "top";
        delete user_profile_tool_position[oppositeVertical];
    }

    if (
        page_settings["breadbutter_post_subscriber_profile_position_horizontal"] && (
            page_settings["breadbutter_post_subscriber_profile_position_horizontal"][0] ==
            "left" ||
            page_settings["breadbutter_post_subscriber_profile_position_horizontal"][0] ==
            "right"
        )
    ) {
        if (!user_profile_tool_position) {
            user_profile_tool_position = {};
        }
        let pos =
            page_settings["breadbutter_post_subscriber_profile_position_horizontal"][0];
        let pixel =
            page_settings["breadbutter_post_subscriber_profile_position_horizontal_px"]?.[0];
        user_profile_tool_position[pos] = pixel;

        let oppositeHorizontal = pos === "left" ? "right" : "left";
        delete user_profile_tool_position[oppositeHorizontal];
    }
    if (typeof BB_GATING_EMAIL_OPTION_OVERWRITE !== "undefined" && BB_GATING_EMAIL_OPTION_OVERWRITE != 'inherit') {
        data['email_option_overwrite'] = BB_GATING_EMAIL_OPTION_OVERWRITE;
    }
    if (typeof BB_GATING_ALLOWED_SSO_PROVIDERS !== "undefined" && BB_GATING_ALLOWED_SSO_PROVIDERS != 'inherit') {
        data['allowed_sso_providers'] = BB_GATING_ALLOWED_SSO_PROVIDERS.split(',');
    }
    if (typeof BB_GATING_REQUIRE_NAMES !== "undefined" && BB_GATING_REQUIRE_NAMES) {
        data['include_name'] = true;
        data['require_name'] = true;
    }


    data = {
        ...data,
        ...continue_with_config
    };
    let is_admin_page = typeof BB_IS_ADMIN_PAGE !== "undefined" && BB_IS_ADMIN_PAGE;
    let is_new_admin = typeof BB_IS_NEW_ADMIN_USER !== "undefined" && BB_IS_NEW_ADMIN_USER;

    if (typeof BB_IS_ADMIN_PAGE !== "undefined" && BB_IS_ADMIN_PAGE) {
        data["capture_form_submission"] = false;
        data['wordpress_admin_page'] = true;
    }

    BreadButter.configure(data).then((up, dv)=> {
        if (!is_admin_page) {
            if (typeof BB_IS_USER_LOGGED_IN != 'undefined' && !BB_IS_USER_LOGGED_IN) {
                //reload once then check the getProfile
                //will use localStorage to store the check
                if (typeof BREADBUTTER_ENABLE_CALLBACK !== "undefined" && BREADBUTTER_ENABLE_CALLBACK) {
                    BreadButter.getProfile((a, b, c) => {
                        if (c === true) {
                            BreadButter.api.resetDeviceVerification(() => {
                                window.location.reload()
                            })
                        }
                    })
                }
                // if (localStorage) {
                //     let first = localStorage.getItem('bb_wordopress_user_not_login_first');
                //     if (first == '1') {
                //
                //     } else {
                //         localStorage.setItem('bb_wordopress_user_not_login_first', '1');
                //         window.location.reload();
                //     }
                // }
            }
            if (!up) {
                if (jQuery && jQuery('[rel=breadbutter_connect_validation]')) {
                    jQuery('[rel=breadbutter_connect_validation]').removeClass('hidden');
                }
            }

            if (typeof BB_POST_CONTACTUS !== "undefined" && BB_POST_CONTACTUS && typeof BB_POST_CONTACTUS_DATA !== "undefined") {
                let C_US = BB_POST_CONTACTUS_DATA;
                let contactus_options = {
                    ...C_US
                };
                if (typeof BB_CONTACTUS_OVERRIDE_REG_DESTINATION_URL !== "undefined" &&
                    BB_CONTACTUS_OVERRIDE_REG_DESTINATION_URL
                ) {
                    contactus_options.registration_destination_url = document.location.href;
                }
                BreadButter.ui.contactUs(contactus_options);
            }
        } else if (is_new_admin && ADMIN_HOOK && ADMIN_HOOK.indexOf('breadbutter_connect') >= -1) {
            BreadButter.events.custom('wpp-intro', function() {console.log('wpp-intro sent.');});
        }
        // let deactivate_button = document.querySelector('#deactivate-bread-butter');
        //
        // if (deactivate_button) {
        //     deactivate_button.addEventListener('click', function(e) {
        //         e.preventDefault(); // Stop the link from navigating immediately
        //         const targetHref = deactivate_button.href; // Store the href
        //         // Fire the event, then redirect
        //         BreadButter.events.custom('wpp_uninstall', function() {
        //             window.location.href = targetHref;
        //         });
        //     });
        // }
    });

    let continue_with_position = false;

    if (
        page_settings["breadbutter_continue_with_position_vertical"] == "top" ||
        page_settings["breadbutter_continue_with_position_vertical"] == "bottom"
    ) {
        if (!continue_with_position) {
            continue_with_position = {};
        }
        let pos = page_settings["breadbutter_continue_with_position_vertical"];
        let pixel =
            page_settings["breadbutter_continue_with_position_vertical_px"];
        continue_with_position[pos] = pixel;
    }

    if (
        page_settings["breadbutter_continue_with_position_horizontal"] ==
            "left" ||
        page_settings["breadbutter_continue_with_position_horizontal"] ==
            "right"
    ) {
        if (!continue_with_position) {
            continue_with_position = {};
        }
        let pos =
            page_settings["breadbutter_continue_with_position_horizontal"];
        let pixel =
            page_settings["breadbutter_continue_with_position_horizontal_px"];
        continue_with_position[pos] = pixel;
    }

    if (continue_with_position) {
        page_config["continue_with_position"] = continue_with_position;
    }

    if (!enable_page_settings) {
        page_config = {};
        if (bb_config_params["continue_with_all_pages"]) {
            has_continue_with = true;
        }
    } else {
        user_profile_tool_enabled = page_user_profile_tool_enabled;
        has_continue_with = page_has_continue_with;
    }

    // if (is_home_url) {
    //     if (continue_with_home) {
    //         has_continue_with = true;
    //     } else {
    //         has_continue_with = false;
    //     }
    // }

    if (typeof BB_POST_IS_RESTRICTED !== "undefined") {
        has_continue_with = true;
        page_config["destination_url"] = document.location.href;
        page_config["show_login_focus"] = true;
        page_config["ignore_email_identification"] = true;
        document.addEventListener("DOMContentLoaded", function () {
            document.body.classList.add('bb-content-r');
        });
        if (typeof BB_RESTRICTED_POST_LOCALE !== "undefined") {
            page_config['locale'] = BB_RESTRICTED_POST_LOCALE;
        }
    }

    if (Object.keys(post_locale).length > 0) {
        page_config['locale'] = { POPUP: post_locale };
    }

    if (typeof bb_config_params.hide_verified !== "undefined") {
        page_config['hide_verified'] = bb_config_params.hide_verified;
    }

    if (continue_with_delay_seconds) {
        page_config['delay_seconds'] = Number(continue_with_delay_seconds);
    }
    if (has_continue_with) {
        if (continue_with_config.continue_with_success_header) {
            page_config['success_header'] = continue_with_config.continue_with_success_header;
        }
        if (continue_with_config.continue_with_success_text) {
            page_config['success_text'] = continue_with_config.continue_with_success_text;
        }
        if (continue_with_config.continue_with_success_seconds) {
            page_config['success_seconds'] = continue_with_config.continue_with_success_seconds;
        }
        if (continue_with_email_option_overwrite) {
            page_config['email_option_overwrite'] = continue_with_email_option_overwrite;
        }
        if (continue_with_allowed_sso_providers) {
            page_config['allowed_sso_providers'] = continue_with_allowed_sso_providers;
        }
        if (continue_with_require_names) {
            page_config['include_name'] = true;
            page_config['require_name'] = true;
        }


        if (typeof BB_POST_IS_RESTRICTED !== "undefined") {
            if (typeof BB_GATING_EMAIL_OPTION_OVERWRITE !== "undefined" && BB_GATING_EMAIL_OPTION_OVERWRITE != 'inherit') {
                page_config['email_option_overwrite'] = BB_GATING_EMAIL_OPTION_OVERWRITE;
            }
            if (typeof BB_GATING_ALLOWED_SSO_PROVIDERS !== "undefined" && BB_GATING_ALLOWED_SSO_PROVIDERS != 'inherit') {
                page_config['allowed_sso_providers'] = BB_GATING_ALLOWED_SSO_PROVIDERS.split(',');
            }
            if (typeof BB_GATING_REQUIRE_NAMES !== "undefined" && BB_GATING_REQUIRE_NAMES) {
                page_config['include_name'] = true;
                page_config['require_name'] = true;
            }

            if (typeof BB_IS_ADMIN_USER !== "undefined" && BB_IS_ADMIN_USER) {
                page_config['success_header'] = "Content Gate Enabled";
                page_config['success_text'] = "Because you are currently logged in as an Administrator in WordPress, you automatically have access to the content gate area. To test this function, please launch the same page in an incognito browser."
                page_config['success_seconds'] = 0;
            }
        }

        document.addEventListener("DOMContentLoaded", function (event) {
            if ((typeof BB_IS_USER_LOGGED_IN == 'undefined' || !BB_IS_USER_LOGGED_IN) && !bb_config_params.use_ui) {
                BreadButter.widgets.continueWith(page_config);
            }
            if (bb_config_params.use_ui) {
                page_config.onLogout = bbOnLogout;
                if (bb_config_params.show_logged_in_profile && bb_config_params.show_logged_in_profile == 'on') {
                    page_config['show_logged_in_profile'] = true;
                }
                if (user_profile_tool_enabled) {
                    page_config['show_logged_in_profile'] = false;
                }
                // BreadButter.getProfile((a, b, c) => {
                //     if (c !== true) {
                BreadButter.ui.continueWith(page_config);
                // }
                // });
            }
        });
    }
    if (has_content_gating) {
        document.addEventListener("DOMContentLoaded", function (event) {
            BreadButter.ui.contentGating(content_gating_config);
        });
    }
    if (user_profile_tool_enabled) {
        document.addEventListener("DOMContentLoaded", function (event) {
            let data = {
                onLogout: bbOnLogout,
                continue_with_position: user_profile_tool_position
            }
            BreadButter.ui.profileWidget(data);
        });
    }

    let cookie_consent = bb_config_params.cookie_consent || {};
    if (cookie_consent.enabled) {
        document.addEventListener("DOMContentLoaded", function (event) {
            let options = {};
            if (cookie_consent.header_text) {
                options.header_text = cookie_consent.header_text;
            }
            if (cookie_consent.main_text) {
                options.main_text = cookie_consent.main_text;
            }
            BreadButter.ui.cookieConsent(options);
        });
    }

    const failedCookie = document.cookie.split(";").find(function (c) {
        return c.includes("bb_auth_failed");
    });
    if (failedCookie) {
        document.cookie =
            "bb_auth_failed=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        BreadButter.api.resetDeviceVerification(function () {});
    }

    if (bb_config_params['custom_events']) {
        document.addEventListener("DOMContentLoaded", function () {
            const custom_events = JSON.parse(bb_config_params['custom_events']);
            const getElements = function (element) {
                // Check by selector.
                const bySelector = document.querySelectorAll(element);
                if (bySelector.length > 0) {
                    return bySelector;
                }
                // Check by name attribute.
                const byName = document.querySelectorAll(`[name="${element}"]`);
                if (byName.length > 0) {
                    return byName;
                }
                
                // Check by id attribute.
                const byId = /^\w/.test(element) ? document.querySelectorAll(`#${element}`) : [];
                if (byId.length > 0) {
                    return byId;
                }
            };
            custom_events.forEach(function(item) {
                let elements = [];
                if (item.element) {
                    elements = getElements(item.element);
                }
                if (elements && elements.length > 0) {
                    elements.forEach(function(element) {
                        element.addEventListener('click', function() {
                            BreadButter.events.custom(item.code, function() {console.log('Done');});
                        });
                    });
                }
            });
        });
    }

    if (bb_config_params['secure_forms']) {
        document.addEventListener("DOMContentLoaded", function () {
            const secure_forms = JSON.parse(bb_config_params['secure_forms']);
            secure_forms.forEach(function(item) {
                const form = document.getElementById(item.formId);
                const submit = document.getElementById(item.submitId);
                if (form && submit) {
                    const controlConfig = {
                        form: item.formId,
                        submit: item.submitId,
                    };
                    if (item.eventCode) {
                        controlConfig.event = item.eventCode;
                    }
                    if (item.emailId) {
                        controlConfig.email = item.emailId;
                    }
                    if (item.firstNameId) {
                        controlConfig.first_name = item.firstNameId;
                    }
                    if (item.lastNameId) {
                        controlConfig.last_name = item.lastNameId;
                    }
                    if (item.fullNameId) {
                        controlConfig.name = item.fullNameId;
                    }
                    BreadButter.ui.applyFormControl(controlConfig);
                }
            });
        });
    }
    BreadButter.config = page_config;
};

loadBreadButterConfiguration();