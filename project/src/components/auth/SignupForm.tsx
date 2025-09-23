import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

interface SignupFormProps {
  onToggleMode: () => void;
}

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signup, isLoading } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
    } catch (error) {
      setErrors({ email: 'Account creation failed' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-orange rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <UserIcon className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Join NASA</h1>
        <p className="text-gray-400">Create your Mission Control account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          label="Full Name"
          placeholder="Dr. Jane Smith"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          icon={<UserIcon className="w-5 h-5" />}
        />

        <Input
          type="email"
          label="Email Address"
          placeholder="jane.smith@nasa.gov"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          icon={<EnvelopeIcon className="w-5 h-5" />}
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            icon={<LockClosedIcon className="w-5 h-5" />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          icon={<LockClosedIcon className="w-5 h-5" />}
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            className="mt-1 rounded border-gray-300 text-neon-aqua focus:ring-neon-aqua"
            required
          />
          <span className="ml-2 text-sm text-gray-400">
            I agree to the{' '}
            <a href="#" className="text-neon-aqua hover:text-neon-aqua/80 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-neon-aqua hover:text-neon-aqua/80 transition-colors">
              Privacy Policy
            </a>
          </span>
        </div>

        <Button type="submit" variant="neon" className="w-full" loading={isLoading}>
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-neon-aqua hover:text-neon-aqua/80 transition-colors font-medium"
          >
            Sign in
          </button>
        </p>
      </form>
    </motion.div>
  );
};