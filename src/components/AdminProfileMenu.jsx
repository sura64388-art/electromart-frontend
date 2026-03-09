import { LogOut, User } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const AdminProfileMenu = () => {
	const { user, logout } = useUserStore();

	return (
		<div className="relative group">
			<div className="flex items-center gap-2 cursor-pointer">
				<div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center">
					{user?.name?.[0]}
				</div>
			</div>

			<div
				className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900
				border border-slate-200 dark:border-slate-800
				rounded-lg shadow-lg opacity-0 group-hover:opacity-100
				pointer-events-none group-hover:pointer-events-auto
				transition"
			>
				<div className="px-4 py-3 text-sm">
					<p className="font-medium">{user?.name}</p>
					<p className="text-slate-500 text-xs">{user?.email}</p>
				</div>

				<button
					onClick={logout}
					className="w-full flex items-center gap-2 px-4 py-2 text-sm
					hover:bg-slate-100 dark:hover:bg-slate-800"
				>
					<LogOut size={16} /> Logout
				</button>
			</div>
		</div>
	);
};

export default AdminProfileMenu;
