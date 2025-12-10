"""
import logging

import docker

docker_client = docker.from_env()


def get_container(container_name):
    try:
        return docker_client.containers.get(container_name)
    except Exception as e:
        logging.error("Exception get_container : {}".format(e))
        return False


def run_container(image_name, environment_dict, is_detach, mem_limit, ports_dict, cont_name):
    try:
        return docker_client.containers.run(image_name, environment=environment_dict, detach=is_detach,
                                            mem_limit=mem_limit, ports=ports_dict, name=cont_name, remove=True)
    except Exception as e:
        logging.error("Exception get_container : {}".format(e))
        return False
"""
