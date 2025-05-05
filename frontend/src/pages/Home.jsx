import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useInView } from "react-intersection-observer";


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom, duration: 0.6 },
  }),
};

export default function Home() {
  return (
    <>
      <Helmet>
        <title>TaskManager - Organize Your Life</title>
        <meta
          name="description"
          content="TaskManager helps you organize, manage, and complete tasks efficiently with a clean interface."
        />
      </Helmet>

      <main className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-white">

        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-300 opacity-30 rounded-full filter blur-3xl animate-pulse z-0" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-300 opacity-30 rounded-full filter blur-3xl animate-pulse z-0" />

        <div className="relative z-10 w-full max-w-5xl text-center">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-4xl md:text-5xl font-bold text-blue-700 mb-4"
          >
            Welcome to TaskManager
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-lg text-gray-700 mb-8"
          >
            Organize your life with ease. Create, manage and track your daily tasks – all in one clean interface.
          </motion.p>

          <motion.div
            className="flex justify-center gap-4 mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white border border-blue-200 text-blue-600 px-6 py-2 rounded-xl hover:bg-blue-50 transition"
            >
              Sign Up
            </Link>
          </motion.div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <AnimatedFeature
              title="Secure Login"
              desc="Encrypted authentication for your privacy."
              delay={0.2}
            />
            <AnimatedFeature
              title="Smart Sorting"
              desc="Sort your tasks by title, date or completion."
              delay={0.4}
            />
            <AnimatedFeature
              title="Pin & Complete"
              desc="Highlight and complete tasks with ease."
              delay={0.6}
            />
          </section>
        </div>
      </main>
    </>
  );
}

function AnimatedFeature({ title, desc, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition text-left"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}
