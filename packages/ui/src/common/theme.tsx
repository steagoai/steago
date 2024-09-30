import { Button } from '../base/button';
import { useTheme } from 'next-themes';
import { Field, Label } from '../base/fieldset';
import { Listbox, ListboxLabel, ListboxOption } from '../base/listbox';
import {
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/16/solid';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '../base/dialog';

/**
 * Props type for the SetThemeDialog component.
 */
type SetThemeDialogProps = {
  appName?: string;
};

/**
 * Ref type for the SetThemeDialog component.
 */
export type SetThemeDialogRef = {
  openDialog: () => void;
  closeDialog: () => void;
};

/**
 * Component for setting the theme of the application.
 *
 * @param {SetThemeDialogProps} props - The props for the component.
 * @param {Ref<SetThemeDialogRef>} ref - The ref passed to the component.
 * @return {JSX.Element} The dialog component for setting the theme.
 */
const SetThemeDialog = forwardRef<SetThemeDialogRef, SetThemeDialogProps>(
  // The forwardRef function is used to allow the parent component to get a reference to the SetThemeDialog component.
  // This is necessary for the parent component to be able to call methods on the SetThemeDialog component.
  // The _ parameter is used to align the component signature with the forwardRef function.
  ({ appName = 'Steago' }, ref) => {
    /**
     * ----------------------------------------------------------------------------------------------
     * Setup
     * ----------------------------------------------------------------------------------------------
     * */
    const { theme, setTheme } = useTheme();

    // States
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentTheme, setCurrentTheme] = useState<string | null>(null);

    /**
     * ----------------------------------------------------------------------------------------------
     * useEffects - deals with listening for theme changes (from next-themes as well as this listbox)
     * ----------------------------------------------------------------------------------------------
     * */
    useEffect(() => {
      setCurrentTheme(theme || null);
    }, [theme]);

    useEffect(() => {
      if (currentTheme !== null) {
        setTheme(currentTheme);
        // closeDialog();
      }
    }, [currentTheme, setTheme]);

    /**
     * ----------------------------------------------------------------------------------------------
     * Expose some methods so we can access it outside with useRef
     * ----------------------------------------------------------------------------------------------
     * */
    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    useImperativeHandle(ref, () => ({
      openDialog,
      closeDialog,
    }));

    /**
     * ----------------------------------------------------------------------------------------------
     * Render
     * ----------------------------------------------------------------------------------------------
     * */
    return (
      <>
        {/* {React.Children.map(children, (child) => React.cloneElement(child, { onClick: openDialog }))} */}
        <Dialog size="sm" open={isOpen} onClose={closeDialog}>
          <DialogTitle>Set theme</DialogTitle>
          <DialogDescription>
            What&apos;s your favorite way to use {appName}?
          </DialogDescription>
          <DialogBody>
            <Field>
              <Label>Pick a theme</Label>
              <Listbox
                name="current-theme"
                value={currentTheme}
                onChange={setCurrentTheme}
              >
                <ListboxOption value="system">
                  <ComputerDesktopIcon />
                  <ListboxLabel>System</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="light">
                  <SunIcon />
                  <ListboxLabel>Light</ListboxLabel>
                </ListboxOption>
                <ListboxOption value="dark">
                  <MoonIcon />
                  <ListboxLabel>Dark</ListboxLabel>
                </ListboxOption>
              </Listbox>
            </Field>
          </DialogBody>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export default SetThemeDialog;
