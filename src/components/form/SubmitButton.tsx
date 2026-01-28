import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useFormContext } from "@/hooks/form/useFormContext";

function SubmitButton({
  children = "Submit",
  ...props
}: React.ComponentProps<typeof Button>) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button {...props}>
          {isSubmitting && <Spinner />}
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
}

export default SubmitButton;
