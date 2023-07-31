<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Form\UsuarioType;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\VarDumper\Exception\ThrowingCasterException;

#[Route('/usuario')]
class UsuarioController extends AbstractController
{

    public function __construct(private UsuarioRepository $usuarioRepository)
    {
        $this->usuarioRepository = $usuarioRepository;
    }

    //el index de usuarios pero controlando el rol
    #[Route('/', name: 'app_usuario_index', methods: ['GET'])]
    public function index(): Response
    {
        // valida si solo se auth con admin
        if ($this->isGranted('ROLE_ADMIN') || $this->isGranted('["ROLE_NEW"]')) {
            return $this->render('usuario/index.html.twig');
        } else {
            return $this->render('usuario/accessDenied.html.twig');
        }
    }

    //obtiene todos los usuarios con api
    #[Route('/get', name: 'app_usuario_mostrar', methods: ['GET'])]
    public function mostrar(EntityManagerInterface $entityManager): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {
            $solicitud = $entityManager
                ->getRepository(Usuario::class)
                ->findAll();
            return $this->json($solicitud);
        } else {
            return $this->render('usuario/accessDenied.html.twig');
        }
    }

    //llabmhndo forbmulario crear rehnder
    #[Route('/new', name: 'app_usuario_new', methods: ['GET'])]
    public function new(): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->renderForm('usuario/new.html.twig');
        };
        return $this->render('usuario/accessDenied.html.twig');
    }

    //crear el usuario post api
    #[Route('/nuevo', name: 'app_usuario_new_guardar', methods: ['POST'])]
    public function create(Request $request, UserPasswordHasherInterface $userPasswordHasherInterface): Response
    {

        if ($this->isGranted('ROLE_ADMIN')) {
            $contenido = $request->getContent();
            $datos = json_decode($contenido, true); // Convertir JSON a array asociativo
            $usuarionew = new Usuario();

            // Obtener los valores del array asociativo        
            $usuarionew->setNombre($datos['nombre']);
            $usuarionew->setApellido($datos['apellido']);
            $usuarionew->setCorreo($datos['correo']);
            $usuarionew->setUsername($datos['username']);
            $usuarionew->setPassword($datos['password']);
            $usuarionew->setPassword($userPasswordHasherInterface->hashPassword($usuarionew, $datos['password']));
            $usuarionew->setRoles($datos['roles']);
            $usuarionew->setEstado('A');

            $this->usuarioRepository->save($usuarionew, true);
            /* $this->$entityManager->flush(); */
            return $this->json([
                "msg" => "Usuario creado!"
            ]);
        } else {
            return $this->render('usuario/accessDenied.html.twig');
        }
    }

    //editar usuario api cohnsuebmr
    #[Route('/{idUsuario}', name: 'app_usuario_show', methods: ['GET'])]
    public function show($idUsuario): JsonResponse
    {
        $usuario = $this->usuarioRepository->find($idUsuario);

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }

        // Crear un arreglo con los datos del cliente
        $data = [
            'idusuario' => $usuario->getIdUsuario(),
            'nombre' => $usuario->getNombre(),
            'apellido' => $usuario->getApellido(),
            'correo' => $usuario->getCorreo(),
            'username' => $usuario->getUsername(),
            'password' => $usuario->getPassword(),
            'roles' => $usuario->getRoles(),
            'estado' => $usuario->getEstado()
        ];

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/{idUsuario}/edit', name: 'app_usuario_edit', methods: ['GET'])]
    public function edit(): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {

            return $this->render('usuario/edit.html.twig');
        } else {
            return $this->render('usuario/accessDenied.html.twig');
        }
    }

    #[Route('/{idUsuario}/editar', name: 'app_usuario_editar', methods: ['PUT'])]
    public function editar(Request $request, Usuario $usuario, EntityManagerInterface $entityManager): Response
    {


        // Obtener los datos del formulario de edición
        $jsonString = $request->getContent();
        $data = json_decode($jsonString, true);

        // Validar los campos que se desean actualizar y mantener los valores existentes si los campos están vacíos
        if (!empty($data['nombre'])) {
            $usuario->setNombre($data['nombre']);
        }
        if (!empty($data['apellido'])) {
            $usuario->setApellido($data['apellido']);
        }
        if (!empty($data['correo'])) {
            $usuario->setCorreo($data['correo']);
        }
        if (!empty($data['username'])) {
            $usuario->setUsername($data['username']);
        }
        if (!empty($data['password'])) {
            $usuario->setPassword($data['password']);
        }
        if (!empty($data['roles'])) {
            $usuario->setRoles($data['roles']);
        }
        $usuario->setEstado('A');
        // Guardar los cambios en la base de datos
        $entityManager->flush();

        return $this->json([
            "msg" => "Usuario actualizado!"
        ]);
    }

    //eliminar usuario api
    #[Route('/{id}', name: 'app_usuario_delete', methods: ['POST'])]
    public function delete(Request $request, Usuario $usuario, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete' . $usuario->getIdUsuario(), $request->request->get('_token'))) {
            $entityManager->remove($usuario);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_usuario_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/{id}/delete', name: 'delete_usuario', methods: ['PUT'])]
    public function deleteCliente(int $id, Usuario $usuario): Response
    {
        $usuario->setEstado('N');

        $this->usuarioRepository->save($usuario, true);

        return $this->json([
            "msg" => "Usuario con id: " . $id . ", eliminado"
        ]);
    }
}
