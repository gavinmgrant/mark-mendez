interface EmailTemplateContactProps {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export function EmailTemplateContact({
  firstName,
  lastName,
  email,
  message,
}: EmailTemplateContactProps) {
  return (
    <div>
      <p>Follow up with this lead from markhmendez.com</p>
      <p>First Name: {firstName}</p>
      <p>Last Name: {lastName}</p>
      <p>Email: {email}</p>
      <p>Message: {message}</p>
    </div>
  );
}
