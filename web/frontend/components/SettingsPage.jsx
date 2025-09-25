import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  ColorPicker,
  RangeSlider,
  Checkbox,
  Button,
  Stack,
  Heading,
  TextContainer,
  Banner,
  hsbToRgb,
  rgbToHsb,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useEffect, useCallback } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    heartColor: "#e91e63",
    heartColorActive: "#c2185b", 
    dropdownItems: 5,
    wishlistPageUrl: "/pages/wishlist",
    enableGuestWishlist: true,
    enableWishlistSharing: false,
    maxWishlistItems: 100,
  });

  const [heartColorHsb, setHeartColorHsb] = useState({ hue: 0, saturation: 0, brightness: 0 });
  const [activeColorHsb, setActiveColorHsb] = useState({ hue: 0, saturation: 0, brightness: 0 });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Convert hex to HSB for color picker
  const hexToHsb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgbToHsb({ red: r * 255, green: g * 255, blue: b * 255 });
  };

  // Convert HSB to hex
  const hsbToHex = (hsb) => {
    const { red, green, blue } = hsbToRgb(hsb);
    return `#${Math.round(red).toString(16).padStart(2, '0')}${Math.round(green).toString(16).padStart(2, '0')}${Math.round(blue).toString(16).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Load saved settings - in real app, fetch from API
    setHeartColorHsb(hexToHsb(settings.heartColor));
    setActiveColorHsb(hexToHsb(settings.heartColorActive));
  }, []);

  const handleSettingChange = useCallback((field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const handleHeartColorChange = useCallback((color) => {
    setHeartColorHsb(color);
    handleSettingChange('heartColor', hsbToHex(color));
  }, [handleSettingChange]);

  const handleActiveColorChange = useCallback((color) => {
    setActiveColorHsb(color);
    handleSettingChange('heartColorActive', hsbToHex(color));
  }, [handleSettingChange]);

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real app, send to backend
    console.log('Saving settings:', settings);
    
    setLoading(false);
    setSaved(true);
    
    // Clear saved message after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Page>
      <TitleBar title="App Settings" />
      <Layout>
        <Layout.Section>
          {saved && (
            <Banner status="success" onDismiss={() => setSaved(false)}>
              <p>Settings saved successfully!</p>
            </Banner>
          )}
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <Heading>Appearance Settings</Heading>
            <TextContainer>
              <p>Customize the look and feel of the wishlist components.</p>
            </TextContainer>
            
            <br />
            
            <FormLayout>
              <FormLayout.Group>
                <div>
                  <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                    Heart Icon Color
                  </label>
                  <ColorPicker
                    onChange={handleHeartColorChange}
                    color={heartColorHsb}
                  />
                  <TextField
                    value={settings.heartColor}
                    onChange={(value) => {
                      handleSettingChange('heartColor', value);
                      setHeartColorHsb(hexToHsb(value));
                    }}
                    placeholder="#e91e63"
                  />
                </div>
                
                <div>
                  <label style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                    Active Heart Color
                  </label>
                  <ColorPicker
                    onChange={handleActiveColorChange}
                    color={activeColorHsb}
                  />
                  <TextField
                    value={settings.heartColorActive}
                    onChange={(value) => {
                      handleSettingChange('heartColorActive', value);
                      setActiveColorHsb(hexToHsb(value));
                    }}
                    placeholder="#c2185b"
                  />
                </div>
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <Heading>Functionality Settings</Heading>
            
            <br />
            
            <FormLayout>
              <TextField
                label="Wishlist Page URL"
                value={settings.wishlistPageUrl}
                onChange={(value) => handleSettingChange('wishlistPageUrl', value)}
                placeholder="/pages/wishlist"
                helpText="The URL where customers can view their full wishlist"
              />

              <div>
                <label style={{ fontWeight: 600, marginBottom: '16px', display: 'block' }}>
                  Dropdown Items: {settings.dropdownItems}
                </label>
                <RangeSlider
                  label=""
                  value={settings.dropdownItems}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(value) => handleSettingChange('dropdownItems', value)}
                  helpText="Number of items to show in the wishlist dropdown"
                />
              </div>

              <div>
                <label style={{ fontWeight: 600, marginBottom: '16px', display: 'block' }}>
                  Max Wishlist Items: {settings.maxWishlistItems}
                </label>
                <RangeSlider
                  label=""
                  value={settings.maxWishlistItems}
                  min={10}
                  max={500}
                  step={10}
                  onChange={(value) => handleSettingChange('maxWishlistItems', value)}
                  helpText="Maximum number of items a customer can add to their wishlist"
                />
              </div>

              <Checkbox
                label="Enable guest wishlist (cookies)"
                checked={settings.enableGuestWishlist}
                onChange={(value) => handleSettingChange('enableGuestWishlist', value)}
                helpText="Allow non-logged-in customers to create wishlists using browser storage"
              />

              <Checkbox
                label="Enable wishlist sharing"
                checked={settings.enableWishlistSharing}
                onChange={(value) => handleSettingChange('enableWishlistSharing', value)}
                helpText="Allow customers to share their wishlists with others"
              />
            </FormLayout>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <Stack distribution="trailing">
              <Button
                primary
                onClick={handleSave}
                loading={loading}
              >
                Save Settings
              </Button>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}